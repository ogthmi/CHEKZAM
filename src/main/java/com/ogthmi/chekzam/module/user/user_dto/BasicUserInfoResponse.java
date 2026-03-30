package com.ogthmi.chekzam.module.user.user_dto;

import com.ogthmi.chekzam.module.user.user_enum.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class BasicUserInfoResponse {
    private String userId;
    private String username;
    private String firstName;
    private String lastName;
    private List<Role> roles;
}
