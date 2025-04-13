package com.ogthmi.chekzam.mapper;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.request.UserRequest;
import com.ogthmi.chekzam.dto.response.user.UserProfileResponse;
import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import com.ogthmi.chekzam.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
public class UserMapper {
    public UserTokenResponse toTokenUserResponse(User user) {
        return UserTokenResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .build();
    }

    public UserProfileResponse toUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .email(user.getEmail())
                .birthdate(user.getBirthdate())
                .gender(user.getGender().getGenderName())
                .school(user.getSchool())
                .department(user.getDepartment())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toUser(UserRequest userRequest, String encodedPassword, List<Role> roles){
        return User.builder()
                .username(userRequest.getUsername())
                .password(encodedPassword)
                .fullName(userRequest.getFullName())
                .birthdate(userRequest.getBirthdate())
                .gender(userRequest.getGender())
                .roles(roles)
                .school(userRequest.getSchool())
                .department(userRequest.getDepartment())
                .email(userRequest.getEmail())
                .createdAt(LocalDateTime.now())
                .build();
    }
}

