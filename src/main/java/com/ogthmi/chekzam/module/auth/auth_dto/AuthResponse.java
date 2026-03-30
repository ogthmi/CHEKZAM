package com.ogthmi.chekzam.module.auth.auth_dto;

import com.ogthmi.chekzam.module.user.user_dto.BasicUserInfoResponse;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AuthResponse {
    private String accessToken;
    private BasicUserInfoResponse basicUserInfoResponse;

}
