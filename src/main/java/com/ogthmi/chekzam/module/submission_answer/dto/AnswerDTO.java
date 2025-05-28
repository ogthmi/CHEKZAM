package com.ogthmi.chekzam.module.answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AnswerDTO {
    private String answerId;
    private Integer answerOrder;
    private String answerContent;
    private boolean isCorrect;
}
