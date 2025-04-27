package com.ogthmi.chekzam.mapper;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.user.UserInfoRequest;
import com.ogthmi.chekzam.dto.user.BasicUserInfoResponse;
import com.ogthmi.chekzam.dto.user.FullUserInfoResponse;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.util.DateTimeUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class UserMapper {
    public BasicUserInfoResponse toBasicUserInfoResponse(User user) {
        return BasicUserInfoResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .build();
    }

    public FullUserInfoResponse toFullUserInfoResponse(User user) {
        return FullUserInfoResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .email(user.getEmail())
                .birthdate(user.getBirthdate())
                .gender(user.getGender().getGenderName())
                .school(user.getSchool())
                .department(user.getDepartment())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toUser(UserInfoRequest userInfoRequest, String encodedPassword, List<Role> roles){
        return User.builder()
                .username(userInfoRequest.getUsername())
                .password(encodedPassword)
                .firstName(userInfoRequest.getFirstName())
                .lastName(userInfoRequest.getLastName())
                .birthdate(userInfoRequest.getBirthdate())
                .gender(userInfoRequest.getGender())
                .roles(roles)
                .school(userInfoRequest.getSchool())
                .department(userInfoRequest.getDepartment())
                .email(userInfoRequest.getEmail())
                .createdAt(LocalDateTime.now())
                .build();
    }
}

