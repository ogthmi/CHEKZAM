package com.ogthmi.chekzam.module.assignment_classroom.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentClassroomId implements Serializable {
    private String assignmentEntity; // variable name must be identical to entity class name
    private String classroomEntity;
}
