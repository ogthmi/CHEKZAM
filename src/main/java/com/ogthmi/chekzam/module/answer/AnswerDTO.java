package com.ogthmi.chekzam.module.answer;

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
