package com.ogthmi.chekzam.module.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class QuestionDTO<T> {
    private String questionId;
    private Integer questionOrder;
    private String questionContent;
    private List<T> answerList;
}
