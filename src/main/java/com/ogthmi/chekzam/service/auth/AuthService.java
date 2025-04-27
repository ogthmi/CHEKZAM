package com.ogthmi.chekzam.service.auth;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.ogthmi.chekzam.dto.auth.SignInRequest;
import com.ogthmi.chekzam.dto.token.TokenRequest;
import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.dto.auth.AuthResponse;
import com.ogthmi.chekzam.dto.token.TokenResponse;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.UserRepository;
import com.ogthmi.chekzam.service.user.UserService;
import com.ogthmi.chekzam.util.JwtUtil;
import com.ogthmi.chekzam.service.user.RegisterUserService;
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

    public AuthResponse toAuthenticationResponse(User user){
        String token = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .basicUserInfoResponse(userMapper.toBasicUserInfoResponse(user))
                .build();
    }

    public AuthResponse authenticate(SignInRequest signInRequest) {
        User user =  userService.findUserByUsername(signInRequest.getUsername());
        boolean isAuthenticated = passwordEncoder.matches(signInRequest.getPassword(), user.getPassword());
        if (!isAuthenticated){
            throw new ApplicationException(ExceptionMessageCode.INCORRECT_PASSWORD);
        }

        log.info("Đăng nhập thành công: {}", user.getUserId());
        return toAuthenticationResponse(user);
    }

    public AuthResponse registerUserWithToken(UserInfoRequest userInfoRequest){
        User newUser = registerUserService.registerUser(userInfoRequest);
        log.info("Đăng ký thành công: {}", newUser.getUserId());
        return toAuthenticationResponse(newUser);
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
        User currentUser = userService.findUserByUsername(username);
        log.info("Làm mới token cho ngươi dùng {} thành công.", currentUser.getUserId());
        return TokenResponse.builder()
                .token(jwtUtil.generateToken(currentUser))
                .valid(true)
                .build();
    }

}
