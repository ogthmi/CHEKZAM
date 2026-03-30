package com.ogthmi.chekzam.module.user.user_dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ogthmi.chekzam.module.user.user_enum.Gender;
import com.ogthmi.chekzam.module.user.user_enum.Role;
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

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthdate;

    private Role role;
    private String school;
    private String department;
    private String email;
}
