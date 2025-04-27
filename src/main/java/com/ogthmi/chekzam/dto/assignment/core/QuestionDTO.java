package com.ogthmi.chekzam.dto.assignment.core;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private String questionId;
    private int questionOrder;
    private String questionContent;
    private List<AnswerDTO> answerList;
}
