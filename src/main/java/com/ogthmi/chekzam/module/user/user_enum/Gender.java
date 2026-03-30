package com.ogthmi.chekzam.module.user.user_enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ");

    private final String genderName;
}
