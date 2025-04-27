package com.ogthmi.chekzam.util;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.ogthmi.chekzam.dto.token.TokenRequest;
import com.ogthmi.chekzam.dto.token.TokenResponse;
import com.ogthmi.chekzam.entity.InvalidateToken;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.repository.InvalidatedTokenRepository;
import lombok.experimental.NonFinal;
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
    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.issuer}")
    private String ISSUER;

    @NonFinal
    @Value("${jwt.expiration-duration}")
    private  int EXPIRATION_DURATION;

    @NonFinal
    @Value(("${jwt.refreshable-duration}"))
    private int REFRESHABLE_DURATION;

    public JwtUtil(InvalidatedTokenRepository invalidatedTokenRepository) {
        this.invalidatedTokenRepository = invalidatedTokenRepository;
    }

    public String buildScope(User user){
        return user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.joining(" "));
    }

    public String generateToken(User user) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .claim("scope", buildScope(user))
                    .issuer(ISSUER)
                    .issueTime(new Date())
                    .expirationTime(new Date(
                            Instant.now().plus(EXPIRATION_DURATION, ChronoUnit.MINUTES).toEpochMilli()
                    ))
                    .jwtID(UUID.randomUUID().toString())
                    .build();

            JWSObject jwsObject = new JWSObject(header, new Payload(jwtClaimsSet.toJSONObject()));

            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));

            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new ApplicationException(ExceptionMessageCode.CREATE_TOKEN_FAILED);
        }
    }

    public SignedJWT verifyToken(String tokenRequest, boolean isRefreshed) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(tokenRequest);
        verifySignature(signedJWT);
        verifyExpirationTime(signedJWT, isRefreshed);
        verifyInvalidated(signedJWT);
        return signedJWT;
    }

    private void verifySignature (SignedJWT signedJWT) throws JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        var verified = signedJWT.verify(verifier);
        if (!verified){
            throw new ApplicationException(ExceptionMessageCode.UNAUTHENTICATED);
        }
    }

    private void verifyExpirationTime(SignedJWT signedJWT , boolean isRefreshed) throws ParseException {
        Date expirationTime;
        if (isRefreshed){
            expirationTime = new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant()
                    .plus(REFRESHABLE_DURATION, ChronoUnit.DAYS)
                    .toEpochMilli());
        }
        else expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (expirationTime.before(Date.from(Instant.now()))){
            throw new ApplicationException(ExceptionMessageCode.TOKEN_EXPIRED);
        }
    }

    private void verifyInvalidated (SignedJWT signedJWT) throws ParseException {
        String jwtId = signedJWT.getJWTClaimsSet().getJWTID();
        if (invalidatedTokenRepository.existsById(jwtId)){
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
    }

    public void invalidateToken(SignedJWT signedJWT) throws ParseException, JOSEException {
        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidateToken invalidateToken = InvalidateToken.builder()
                .id(jti)
                .expirationTime(expirationTime)
                .build();
        invalidatedTokenRepository.save(invalidateToken);
    }

    public TokenResponse introspect(TokenRequest tokenRequest) throws JOSEException, ParseException {
        try {
            verifyToken(tokenRequest.getToken(), false);
            return TokenResponse.builder().valid(true).build();
        } catch (ApplicationException exception) {
            return TokenResponse.builder().valid(false).build();
        }
    }

}
