package com.ogthmi.chekzam.module.auth.auth_dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SignInRequest {
    private String username;
    private String password;
}
