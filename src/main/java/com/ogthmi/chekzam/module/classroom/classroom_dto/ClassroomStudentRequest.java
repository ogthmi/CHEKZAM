package com.ogthmi.chekzam.module.classroom.classroom_dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClassroomStudentRequest {
    private List<String> studentIdList;
}
