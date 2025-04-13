package com.ogthmi.chekzam.dto.response.user;

import com.ogthmi.chekzam.constant.Gender;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class UserProfileResponse extends UserTokenResponse{
    private String email;
    private String gender;
    private LocalDate birthdate;
    private String school;
    private String department;
    private LocalDateTime createdAt;
}

