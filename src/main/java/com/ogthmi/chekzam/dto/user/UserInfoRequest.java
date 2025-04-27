package com.ogthmi.chekzam.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ogthmi.chekzam.constant.Gender;
import com.ogthmi.chekzam.constant.Role;
import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoRequest {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private Gender gender;

    private LocalDate birthdate;

    private Role role;
    private String school;
    private String department;
    private String email;
}
