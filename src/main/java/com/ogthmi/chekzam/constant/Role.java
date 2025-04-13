package com.ogthmi.chekzam.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {
    ADMIN("Quản trị viên"),
    TEACHER("Giáo viên"),
    STUDENT("Sinh viên");

    private final String roleName;
}
