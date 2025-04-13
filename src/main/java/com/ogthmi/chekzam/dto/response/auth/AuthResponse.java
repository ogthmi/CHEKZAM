package com.ogthmi.chekzam.dto.response.auth;

import com.ogthmi.chekzam.dto.response.user.UserTokenResponse;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AuthResponse {
    private String token;
    private UserTokenResponse userTokenResponse;

}
