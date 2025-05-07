package com.ogthmi.chekzam.module.assignment.assignment_dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentType;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AssignmentRequest {
    private String assignmentId;

    private String assignmentName;
    private String description;

    private AssignmentType assignmentType;

    private List<QuestionDTO> questionList;
}
