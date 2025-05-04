package com.ogthmi.chekzam.module.classroom.classroom_dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ClassroomInfoRequest {
    private String classroomName;
    private String description;
}
