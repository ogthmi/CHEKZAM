package com.ogthmi.chekzam.dto.response.auth;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class TokenResponse {
    private boolean valid;
}
