package com.ogthmi.chekzam.dto.auth;

import com.ogthmi.chekzam.dto.user.BasicUserInfoResponse;
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
