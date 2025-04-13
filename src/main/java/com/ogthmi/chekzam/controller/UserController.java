package com.ogthmi.chekzam.controller;

import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.dto.response.ApiResponse;
import com.ogthmi.chekzam.dto.response.user.UserProfileResponse;
import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import com.ogthmi.chekzam.service.user.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoint.User.ROOT)
@AllArgsConstructor
@Slf4j
@EnableMethodSecurity
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping(Endpoint.User.GET_ALL)
    public ApiResponse<Page<UserTokenResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ){
        return ApiResponse.ok(userService.getAllUsers(page, size));
    }

    @GetMapping(Endpoint.User.GET_ONE)
    public ApiResponse<UserProfileResponse> getUserProfile(@PathVariable String userId) {
        return ApiResponse.ok(userService.getUserProfile(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(Endpoint.User.GET_ONE)
    public ApiResponse<UserProfileResponse> updateProfile(
            @PathVariable String userId,
            @RequestBody UserRequest userRequest){
        return ApiResponse.ok(userService.updateUserInfo(userId, userRequest));
    }

    @GetMapping(Endpoint.User.GET_ME)
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.ok(userService.getMyUserProfile());
    }

    @PutMapping(Endpoint.User.GET_ME)
    public ApiResponse<UserProfileResponse> updateMyProfile(
            @RequestBody UserRequest userRequest){
        return ApiResponse.ok(userService.updateMyProfile(userRequest));
    }
}
