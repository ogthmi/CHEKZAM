package com.ogthmi.chekzam.controller;

import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.dto.api.ApiResponse;
import com.ogthmi.chekzam.dto.user.FullUserInfoResponse;
import com.ogthmi.chekzam.exception.message.SuccessMessageCode;
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
    public ApiResponse<Page<FullUserInfoResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ){
        return ApiResponse.success(
                userService.getAllUsers(pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @GetMapping(Endpoint.User.GET_ONE)
    public ApiResponse<FullUserInfoResponse> getUserProfile(@PathVariable String userId) {
        return ApiResponse.success(userService.getUserProfile(userId), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @GetMapping()
    public ApiResponse<FullUserInfoResponse> searchProfile (@RequestParam String keyword){
        return ApiResponse.success(userService.searchProfile(keyword), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(Endpoint.User.GET_ONE)
    public ApiResponse<FullUserInfoResponse> updateProfile(
            @PathVariable String userId,
            @RequestBody UserInfoRequest userInfoRequest){
        return ApiResponse.success(userService.updateUserInfo(userId, userInfoRequest), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @GetMapping(Endpoint.User.GET_ME)
    public ApiResponse<FullUserInfoResponse> getMyProfile() {
        return ApiResponse.success(userService.getMyUserProfile(), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @PutMapping(Endpoint.User.GET_ME)
    public ApiResponse<FullUserInfoResponse> updateMyProfile(
            @RequestBody UserInfoRequest userInfoRequest){
        return ApiResponse.success(userService.updateMyProfile(userInfoRequest), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }
}
