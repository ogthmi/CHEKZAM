package com.ogthmi.chekzam.module.assignment.assignment_enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AssignmentStatus {
    ASSIGNED("Đã giao"),
    NOT_YET_OPENED("Đã giao nhưng chưa mở"),
    OPEN("Đang mở"),
    CLOSED("Đã đóng");
    private final String status;
}
