package com.ogthmi.chekzam.dto.response.user;

import com.ogthmi.chekzam.constant.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class UserTokenResponse {
    private String userId;
    private String username;
    private String fullName;
    private List<Role> roles;
}
