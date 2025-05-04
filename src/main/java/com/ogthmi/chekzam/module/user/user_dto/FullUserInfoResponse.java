package com.ogthmi.chekzam.module.user.user_dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class FullUserInfoResponse extends BasicUserInfoResponse {
    private String email;
    private String gender;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthdate;

    private String school;
    private String department;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime createdAt;
}

