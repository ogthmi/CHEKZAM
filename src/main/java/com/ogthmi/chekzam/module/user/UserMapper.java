package com.ogthmi.chekzam.module.user;

import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.user_dto.UserInfoRequest;
import com.ogthmi.chekzam.module.user.user_dto.BasicUserInfoResponse;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class UserMapper {
    public BasicUserInfoResponse toBasicUserInfoResponse(UserEntity userEntity) {
        return BasicUserInfoResponse.builder()
                .userId(userEntity.getUserId())
                .username(userEntity.getUsername())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .roles(userEntity.getRoles())
                .build();
    }

    public FullUserInfoResponse toFullUserInfoResponse(UserEntity userEntity) {
        return FullUserInfoResponse.builder()
                .userId(userEntity.getUserId())
                .username(userEntity.getUsername())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .roles(userEntity.getRoles())
                .email(userEntity.getEmail())
                .birthdate(userEntity.getBirthdate())
                .gender(userEntity.getGender().getGenderName())
                .school(userEntity.getSchool())
                .department(userEntity.getDepartment())
                .createdAt(userEntity.getCreatedAt())
                .build();
    }

    public UserEntity toUser(UserInfoRequest userInfoRequest, String encodedPassword, List<Role> roles){
        return UserEntity.builder()
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
                .build();
    }
}

