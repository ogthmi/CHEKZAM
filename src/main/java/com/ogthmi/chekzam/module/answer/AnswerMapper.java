package com.ogthmi.chekzam.module.answer;

import org.springframework.stereotype.Component;

@Component
public class AnswerMapper {
    public Answer toAnswer(AnswerDTO answerDTO) {
        return Answer.builder()
                .answerContent(answerDTO.getAnswerContent())
                .isCorrect(answerDTO.isCorrect())
                .build();
    }

    public AnswerDTO toAnswerDTO(Answer answer) {
        return AnswerDTO.builder()
                .answerId(answer.getAnswerId())
                .answerOrder(answer.getAnswerOrder())
                .answerContent(answer.getAnswerContent())
                .isCorrect(answer.isCorrect())
                .build();
    }
}
