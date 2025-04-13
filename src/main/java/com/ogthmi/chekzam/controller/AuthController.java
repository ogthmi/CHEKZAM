package com.ogthmi.chekzam.controller;

import com.nimbusds.jose.JOSEException;
import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.request.SignInRequest;
import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.dto.request.TokenRequest;
import com.ogthmi.chekzam.dto.response.ApiResponse;
import com.ogthmi.chekzam.dto.response.auth.AuthResponse;
import com.ogthmi.chekzam.dto.response.auth.TokenResponse;
import com.ogthmi.chekzam.util.JwtUtil;
import com.ogthmi.chekzam.service.auth.AuthService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping(Endpoint.Auth.ROOT)
@AllArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping(Endpoint.Auth.SIGNIN)
    public ApiResponse<AuthResponse> authenticatedUser(@RequestBody SignInRequest signInRequest) {
        return ApiResponse.ok(authService.authenticate(signInRequest));
    }

//    @PostMapping(Endpoint.Auth.SIGNIN)
//    public ApiResponse<String> rawJson (@RequestBody String json) {
//        System.out.println(json);
//        return ApiResponse.ok(json);
//    }


    @PostMapping(Endpoint.Auth.SIGNUP)
    public ApiResponse<AuthResponse> registerUser(@RequestBody UserRequest userRequest) {
        return ApiResponse.ok(authService.registerUserWithToken(userRequest));
    }

    @PostMapping(Endpoint.Auth.SIGNOUT)
    public ApiResponse<TokenResponse> signout (@RequestBody TokenRequest tokenRequest) throws ParseException, JOSEException {
        return ApiResponse.ok(authService.signout(tokenRequest));
    }

    @PostMapping(Endpoint.Auth.TOKEN)
    public ApiResponse<TokenResponse> validateToken (@RequestBody TokenRequest tokenRequest) throws ParseException, JOSEException {
        return ApiResponse.ok(jwtUtil.introspect(tokenRequest));
    }
}
