package com.ogthmi.chekzam.dto.assignment.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnswerDTO {
    private String answerId;
    private int answerOrder;
    private String answerContent;
    private boolean isCorrect;
}
