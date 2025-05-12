package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.submission_answer.dto.AnswerDTO;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.answer.AnswerMapper;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class QuestionMapper {
    private final AnswerMapper answerMapper;

    public QuestionEntity toQuestion(QuestionDTO<AnswerDTO> questionDTO) {
        List<AnswerEntity> answerEntities = null;
        if (questionDTO.getAnswerList() != null) {
            answerEntities = questionDTO.getAnswerList().stream()
                    .map(answerMapper::toAnswer)
                    .collect(Collectors.toList());
        }
        return QuestionEntity.builder()
                .questionId(questionDTO.getQuestionId())
                .questionContent(questionDTO.getQuestionContent())
                .answerEntityList(answerEntities)
                .build();
    }

    public QuestionDTO<AnswerDTO> toQuestionDTO(AssignmentQuestionEntity assignmentQuestionEntity) {
        return toQuestionDTO(assignmentQuestionEntity, false);
    }

    public QuestionDTO<AnswerDTO> toQuestionDTOHideCorrectAnswer(AssignmentQuestionEntity assignmentQuestionEntity) {
        return toQuestionDTO(assignmentQuestionEntity, true);
    }

    private QuestionDTO<AnswerDTO> toQuestionDTO(AssignmentQuestionEntity assignmentQuestionEntity, boolean hideCorrectAnswer) {
        QuestionEntity questionEntity = assignmentQuestionEntity.getQuestionEntity();
        List<AnswerDTO> answerDTOList = null;

        if (questionEntity.getAnswerEntityList() != null) {
            answerDTOList = questionEntity.getAnswerEntityList().stream()
                    .map(answer -> {
                        AnswerDTO dto = answerMapper.toAnswerDTO(answer);
                        if (hideCorrectAnswer) {
                            dto.setCorrect(false);
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());
        }

        return QuestionDTO.<AnswerDTO>builder()
                .questionId(questionEntity.getQuestionId())
                .questionOrder(assignmentQuestionEntity.getQuestionOrder())
                .questionContent(questionEntity.getQuestionContent())
                .answerList(answerDTOList)
                .build();
    }
}
