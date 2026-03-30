package com.ogthmi.chekzam.module.auth;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.ogthmi.chekzam.module.auth.auth_dto.SignInRequest;
import com.ogthmi.chekzam.module.auth.token_dto.TokenRequest;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.module.auth.auth_dto.AuthResponse;
import com.ogthmi.chekzam.module.auth.token_dto.TokenResponse;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.user.UserMapper;
import com.ogthmi.chekzam.module.user.UserRepository;
import com.ogthmi.chekzam.module.user.user_service.UserService;
import com.ogthmi.chekzam.common.util.JwtUtil;
import com.ogthmi.chekzam.module.user.user_service.RegisterUserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RegisterUserService registerUserService;

    public AuthResponse toAuthenticationResponse(UserEntity userEntity){
        String token = jwtUtil.generateToken(userEntity);

        return AuthResponse.builder()
                .accessToken(token)
                .basicUserInfoResponse(userMapper.toBasicUserInfoResponse(userEntity))
                .build();
    }

    public AuthResponse authenticate(SignInRequest signInRequest) {
        UserEntity userEntity =  userService.findUserByUsername(signInRequest.getUsername());
        boolean isAuthenticated = passwordEncoder.matches(signInRequest.getPassword(), userEntity.getPassword());
        if (!isAuthenticated){
            throw new ApplicationException(ExceptionMessageCode.INCORRECT_PASSWORD);
        }

        log.info("Đăng nhập thành công: {}", userEntity.getUserId());
        return toAuthenticationResponse(userEntity);
    }

    public AuthResponse registerUserWithToken(UserInfoRequest userInfoRequest){
        UserEntity newUserEntity = registerUserService.registerUser(userInfoRequest);
        log.info("Đăng ký thành công: {}", newUserEntity.getUserId());
        return toAuthenticationResponse(newUserEntity);
    }


    public void signout(TokenRequest tokenRequest) throws ParseException, JOSEException {
        try {
            SignedJWT signedJWT = jwtUtil.verifyToken(tokenRequest.getToken(), true);
            jwtUtil.invalidateToken(signedJWT);
        }
        catch (ApplicationException ignored){}
        finally {
            SecurityContextHolder.clearContext();
        }
    }

    public TokenResponse introspect(TokenRequest tokenRequest) throws JOSEException, ParseException {
        try {
            jwtUtil.verifyToken(tokenRequest.getToken(), false);
            return TokenResponse.builder().valid(true).build();
        } catch (ApplicationException exception) {
            return TokenResponse.builder().valid(false).build();
        }
    }

    public TokenResponse refreshToken (TokenRequest tokenRequest) throws ParseException, JOSEException {
        var signedJWT = jwtUtil.verifyToken(tokenRequest.getToken(), true);
        jwtUtil.invalidateToken(signedJWT);
        String username = signedJWT.getJWTClaimsSet().getSubject();
        UserEntity currentUserEntity = userService.findUserByUsername(username);
        log.info("Làm mới token cho ngươi dùng {} thành công.", currentUserEntity.getUserId());
        return TokenResponse.builder()
                .token(jwtUtil.generateToken(currentUserEntity))
                .valid(true)
                .build();
    }

}
