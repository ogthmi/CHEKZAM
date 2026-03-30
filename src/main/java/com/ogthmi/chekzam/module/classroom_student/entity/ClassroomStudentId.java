package com.ogthmi.chekzam.module.classroom_student.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomStudentId implements Serializable {
    private String classroomEntity;
    private String userEntity;
}
