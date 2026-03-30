package com.ogthmi.chekzam.module.submission_answer.entity;

import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionId;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmittedAnswerId implements Serializable {
    private String submission;        // submission_id
    private String selectedAnswer;    // selected_answer_id
    private String questionId;        // question_id
}
