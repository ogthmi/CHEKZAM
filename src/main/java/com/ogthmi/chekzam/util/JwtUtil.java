package com.ogthmi.chekzam.util;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.ogthmi.chekzam.dto.request.TokenRequest;
import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import com.ogthmi.chekzam.dto.response.auth.TokenResponse;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.MessageCode;
import com.ogthmi.chekzam.repository.InvalidatedTokenRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.issuer}")
    private String ISSUER;

    @NonFinal
    @Value("${jwt.expirationTime}")
    private  int EXPIRATION_TIME;

    public JwtUtil(InvalidatedTokenRepository invalidatedTokenRepository) {
        this.invalidatedTokenRepository = invalidatedTokenRepository;
    }

    public String buildScope(UserTokenResponse userTokenResponse){
        return userTokenResponse.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.joining(" "));
    }

    public String generateToken(UserTokenResponse userTokenResponse) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(userTokenResponse.getUsername())
                    .claim("scope", buildScope(userTokenResponse))
                    .issuer(ISSUER)
                    .issueTime(new Date())
                    .expirationTime(new Date(
                            Instant.now().plus(EXPIRATION_TIME, ChronoUnit.HOURS).toEpochMilli()
                    ))
                    .jwtID(UUID.randomUUID().toString())
                    .build();

            JWSObject jwsObject = new JWSObject(header, new Payload(jwtClaimsSet.toJSONObject()));

            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));

            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new ApplicationException(MessageCode.CREATE_TOKEN_FAILED);
        }
    }

    public SignedJWT verifyToken(String tokenRequest) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(tokenRequest);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!verified){
            throw new ApplicationException(MessageCode.UNAUTHENTICATED);
        }
        System.out.println("Token Expiration time: " + expirationTime);
        if (expirationTime.before(Date.from(Instant.now()))){
            throw new ApplicationException(MessageCode.TOKEN_EXPIRED);
        }
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new ApplicationException(MessageCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    public TokenResponse introspect(TokenRequest tokenRequest) throws JOSEException, ParseException {
        boolean isValidToken = true;
        try {
            verifyToken(tokenRequest.getToken());
        }
        catch (ApplicationException exception){
            isValidToken = false;
        }

        return  TokenResponse.builder()
                .valid(isValidToken)
                .build();
    }

}
