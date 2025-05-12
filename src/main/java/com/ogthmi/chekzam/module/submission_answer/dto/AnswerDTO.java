package com.ogthmi.chekzam.module.submission_answer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@SuperBuilder
public class AnswerDTO {
    private String answerId;
    private int answerOrder;
    private String answerContent;
    private boolean isCorrect;
}
