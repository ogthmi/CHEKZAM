package com.ogthmi.chekzam.module.submission.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.submission_answer.dto.GradedAnswerResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionResponse {
    private String submissionId;

    private String assignmentId;
    private String assignmentName;

    private String classroomId;
    private String classroomName;

    private String userId;
    private String fullName;

    private int takingAttempt;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime startedAt;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime submittedAt;
    private Long durationInSeconds;

    private int totalCorrectQuestions;
    private int totalQuestions;
    private double score;

    private List<QuestionDTO<GradedAnswerResponse>> gradedAnswerList;
}
