package com.ogthmi.chekzam.module.answer;

import org.springframework.stereotype.Component;

@Component
public class AnswerMapper {
    public AnswerEntity toAnswer(AnswerDTO answerDTO) {
        return AnswerEntity.builder()
                .answerId(answerDTO.getAnswerId())
                .answerContent(answerDTO.getAnswerContent())
                .isCorrect(answerDTO.isCorrect())
                .answerOrder(answerDTO.getAnswerOrder())
                .build();
    }


    public AnswerDTO toAnswerDTO(AnswerEntity answerEntity) {
        return AnswerDTO.builder()
                .answerId(answerEntity.getAnswerId())
                .answerOrder(answerEntity.getAnswerOrder())
                .answerContent(answerEntity.getAnswerContent())
                .isCorrect(answerEntity.isCorrect())
                .build();
    }
}
