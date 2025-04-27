package com.ogthmi.chekzam.configuration;

import com.nimbusds.jose.JOSEException;
import com.ogthmi.chekzam.dto.token.TokenRequest;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {

    @Autowired
    private JwtUtil jwtUtil;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            var response = jwtUtil.introspect(TokenRequest.builder().token(token).build());
            if (!response.isValid()){
                throw new ApplicationException(ExceptionMessageCode.NEED_REFRESH_TOKEN);
            }
        }
        catch (JOSEException | ParseException exception){
            throw new JwtException(exception.getMessage());
        }
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
            nimbusJwtDecoder =  NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
