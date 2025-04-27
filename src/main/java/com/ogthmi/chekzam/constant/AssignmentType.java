package com.ogthmi.chekzam.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AssignmentType {
    SINGLE_CHOICE("Trắc nghiệm một áp án"),
    MULTIPLE_CHOICE("Trắc nghiệm nhiều đáp án"),
;
    private final String assignmentType;
}
