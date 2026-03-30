package com.ogthmi.chekzam.module.submission_answer.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAnswerSelectionRequest {
    private String questionId;
    private Set<String> selectedAnswerIdSet;
}

