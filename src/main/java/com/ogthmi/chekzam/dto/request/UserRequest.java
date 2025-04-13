package com.ogthmi.chekzam.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ogthmi.chekzam.constant.Gender;
import com.ogthmi.chekzam.constant.Role;
import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    private String username;
    private String password;
    private String fullName;
    private Gender gender;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birthdate;

    private Role role;
    private String school;
    private String department;
    private String email;
}
