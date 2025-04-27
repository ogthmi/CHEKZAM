package com.ogthmi.chekzam.controller;

import com.nimbusds.jose.JOSEException;
import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.auth.SignInRequest;
import com.ogthmi.chekzam.dto.token.TokenRequest;
import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.dto.api.ApiResponse;
import com.ogthmi.chekzam.dto.auth.AuthResponse;
import com.ogthmi.chekzam.dto.token.TokenResponse;
import com.ogthmi.chekzam.exception.message.SuccessMessageCode;
import com.ogthmi.chekzam.service.auth.AuthService;
import com.ogthmi.chekzam.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping(Endpoint.Auth.ROOT)
@AllArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping(Endpoint.Auth.SIGNIN)
    public ApiResponse<AuthResponse> signin(@RequestBody SignInRequest signInRequest) {
        return ApiResponse.success(
                authService.authenticate(signInRequest),
                SuccessMessageCode.SIGNED_IN_SUCCESSFULLY
        );
    }

    @PostMapping(Endpoint.Auth.SIGNUP)
    public ApiResponse<AuthResponse> signup(@RequestBody UserInfoRequest userInfoRequest) {
        return ApiResponse.success(
                authService.registerUserWithToken(userInfoRequest),
                SuccessMessageCode.SIGNED_UP_SUCCESSFULLY
        );
    }

    @PostMapping(Endpoint.Auth.SIGNOUT)
    public ApiResponse<Void> signout(@RequestBody TokenRequest tokenRequest) throws ParseException, JOSEException {
        authService.signout(tokenRequest);
        return ApiResponse.voidSuccess(SuccessMessageCode.SIGNED_OUT_SUCCESSFULLY);
    }

    @PostMapping(Endpoint.Token.VALIDATE)
    public ApiResponse<TokenResponse> validateToken(@RequestBody TokenRequest tokenRequest) throws ParseException, JOSEException {
        return ApiResponse.success(jwtUtil.introspect(tokenRequest), null);
    }

    @PostMapping(Endpoint.Token.REFRESH)
    public ApiResponse<TokenResponse> refreshToken(@RequestBody TokenRequest tokenRequest) throws ParseException, JOSEException {
        log.info("Expired Token: {}", tokenRequest.getToken());
        return ApiResponse.success(
                authService.refreshToken(tokenRequest),
                SuccessMessageCode.REFRESHED_TOKEN_SUCCESSFULLY);
    }
}
