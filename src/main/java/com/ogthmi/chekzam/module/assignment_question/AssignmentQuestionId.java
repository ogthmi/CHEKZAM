package com.ogthmi.chekzam.module.assignment_question;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentQuestionId implements Serializable {
    private String assignmentEntity; // tên phải TRÙNG với entity
    private String questionEntity;
}
