package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.answer.AnswerMapper;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class QuestionMapper {
    private final AnswerMapper answerMapper;

    public QuestionMapper(AnswerMapper answerMapper) {
        this.answerMapper = answerMapper;
    }

    public QuestionEntity toQuestion(QuestionDTO questionDTO) {
        List<AnswerEntity> answerEntities = null;
        if (questionDTO.getAnswerList() != null) {
            answerEntities = questionDTO.getAnswerList().stream()
                    .map(answerMapper::toAnswer)
                    .collect(Collectors.toList());
        }

        return QuestionEntity.builder()
                .questionId(questionDTO.getQuestionId()) // <-- THÊM DÒNG NÀY
                .questionContent(questionDTO.getQuestionContent())
                .answerEntityList(answerEntities)
                .build();
    }

    public QuestionDTO toQuestionDTO(AssignmentQuestionEntity assignmentQuestionEntity) {
        QuestionEntity questionEntity = assignmentQuestionEntity.getQuestionEntity();

        List<AnswerDTO> answerDTOList = null;
        if (questionEntity.getAnswerEntityList() != null) {
            answerDTOList = questionEntity.getAnswerEntityList().stream()
                    .map(answerMapper::toAnswerDTO)
                    .toList();
        }

        return QuestionDTO.builder()
                .questionId(questionEntity.getQuestionId())
                .questionOrder(assignmentQuestionEntity.getQuestionOrder())
                .questionContent(questionEntity.getQuestionContent())
                .answerList(answerDTOList)
                .build();
    }

}

