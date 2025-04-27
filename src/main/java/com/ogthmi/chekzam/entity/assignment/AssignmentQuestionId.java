package com.ogthmi.chekzam.entity.assignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentQuestionId implements Serializable {
    private String assignment; // tên phải TRÙNG với entity
    private String question;
}
