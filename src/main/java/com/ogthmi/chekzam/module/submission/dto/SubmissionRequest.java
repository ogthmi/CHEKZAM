package com.ogthmi.chekzam.module.submission.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ogthmi.chekzam.module.submission_answer.dto.QuestionAnswerSelectionRequest;
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
public class SubmissionRequest {
    private String submissionId;
    private String assignmentId;
    private String classroomId;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime startedAt;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime submittedAt;


    private List<QuestionAnswerSelectionRequest> studentAnswerList;
}
