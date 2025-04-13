package com.ogthmi.chekzam.service.auth;

import com.nimbusds.jose.JOSEException;
import com.ogthmi.chekzam.dto.request.SignInRequest;
import com.ogthmi.chekzam.dto.request.TokenRequest;
import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.dto.response.auth.AuthResponse;
import com.ogthmi.chekzam.dto.response.auth.TokenResponse;
import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import com.ogthmi.chekzam.entity.InvalidateToken;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.MessageCode;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.InvalidatedTokenRepository;
import com.ogthmi.chekzam.repository.UserRepository;
import com.ogthmi.chekzam.util.JwtUtil;
import com.ogthmi.chekzam.service.user.RegisterUserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    public final UserRepository userRepository;
    public final UserMapper userMapper;
    private JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RegisterUserService registerUserService;
    private final InvalidatedTokenRepository invalidatedTokenRepository;

    public AuthResponse toAuthenticationResponse(UserTokenResponse userTokenResponse){
        String token = jwtUtil.generateToken(userTokenResponse);

        return AuthResponse.builder()
                .token(token)
                .userTokenResponse(userTokenResponse)
                .build();
    }

    public AuthResponse authenticate(SignInRequest signInRequest) {
        User user =  userRepository.findByUsername(signInRequest.getUsername())
                .orElseThrow(() -> new ApplicationException(MessageCode.USER_NOT_FOUND));

        boolean isAuthenticated = passwordEncoder.matches(signInRequest.getPassword(), user.getPassword());
        if (!isAuthenticated){
            throw new ApplicationException(MessageCode.INCORRECT_PASSWORD);
        }
        log.info("Đăng nhập thành công: " + signInRequest.getUsername());
        log.info(userMapper.toTokenUserResponse(user).toString());
        return toAuthenticationResponse(userMapper.toTokenUserResponse(user));
    }

    public AuthResponse registerUserWithToken(UserRequest userRequest){
        User newUser = registerUserService.registerUser(userRequest);
        UserTokenResponse userTokenResponse = userMapper.toTokenUserResponse(newUser);
        log.info("Đăng ký thành công: " + newUser.getUsername());
        return toAuthenticationResponse(userTokenResponse);
    }

    public TokenResponse signout(TokenRequest tokenRequest) throws ParseException, JOSEException {
        var signToken = jwtUtil.verifyToken(tokenRequest.getToken());
        String jti = signToken.getJWTClaimsSet().getJWTID();
        Date expirationTime = signToken.getJWTClaimsSet().getExpirationTime();
        InvalidateToken invalidateToken = InvalidateToken.builder()
                .id(jti)
                .expirationTime(expirationTime)
                .build();
        invalidatedTokenRepository.save(invalidateToken);
        SecurityContextHolder.clearContext();

        return TokenResponse.builder()
                .valid(true)
                .build();
    }

}
