package com.ogthmi.chekzam.module.assignment_classroom;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentClassroomId implements Serializable {
    private String assignment; // variable name must be identical to entity class name
    private String classroom;
}
