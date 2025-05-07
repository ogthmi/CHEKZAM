package com.ogthmi.chekzam.module.user;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import com.ogthmi.chekzam.module.user.user_dto.PasswordChangeRequest;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.module.user.user_service.RegisterUserService;
import com.ogthmi.chekzam.module.user.user_service.UserService;
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
    private final UserMapper userMapper;
    private final RegisterUserService registerUserService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping(Endpoint.User.GET_ALL)
    public ApiResponse<Page<FullUserInfoResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                userService.getAllUsers(pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping(Endpoint.User.GET_ONE)
    public ApiResponse<FullUserInfoResponse> getUserProfile(@PathVariable String userId) {
        return ApiResponse.success(userService.getUserProfile(userId), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping()
    public ApiResponse<FullUserInfoResponse> searchProfile(@RequestParam String keyword) {
        return ApiResponse.success(userService.searchProfile(keyword), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @GetMapping(Endpoint.User.GET_ME)
    public ApiResponse<FullUserInfoResponse> getMyProfile() {
        return ApiResponse.success(userService.getMyUserProfile(), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ApiResponse<FullUserInfoResponse> registerNewUser(@RequestBody UserInfoRequest userInfoRequest) {
        return ApiResponse.success(
                userMapper.toFullUserInfoResponse(registerUserService.registerUser(userInfoRequest)),
                SuccessMessageCode.CREATED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(Endpoint.User.GET_ONE)
    public ApiResponse<FullUserInfoResponse> updateProfile(
            @PathVariable String userId,
            @RequestBody UserInfoRequest userInfoRequest) {
        return ApiResponse.success(userService.updateUserInfo(userId, userInfoRequest), SuccessMessageCode.UPDATED_SUCCESSFULLY);
    }

    @PutMapping(Endpoint.User.GET_ME)
    public ApiResponse<FullUserInfoResponse> updateMyProfile(
            @RequestBody UserInfoRequest userInfoRequest) {
        return ApiResponse.success(userService.updateMyProfile(userInfoRequest), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @PutMapping(Endpoint.User.GET_ME + "/password")
    public ApiResponse<Void> updateMyPassword(
            @RequestBody PasswordChangeRequest passwordChangeRequest) {
        userService.changePassword(passwordChangeRequest);
        return ApiResponse.voidSuccess(SuccessMessageCode.UPDATED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(Endpoint.User.GET_ONE)
    public ApiResponse<Void> deleteUser(@PathVariable  String userId) {
        userService.deleteUser(userId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }
}