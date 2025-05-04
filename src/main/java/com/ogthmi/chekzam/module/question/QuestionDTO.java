package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

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
