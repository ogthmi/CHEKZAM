package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.answer.Answer;
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

    public Question toQuestion(QuestionDTO questionDTO) {
        List<Answer> answers = null;
        if (questionDTO.getAnswerList() != null) {
            answers = questionDTO.getAnswerList().stream()
                    .map(answerMapper::toAnswer)
                    .collect(Collectors.toList());
        }

        return Question.builder()
                .questionContent(questionDTO.getQuestionContent())
                .answerList(answers)
                .build();
    }

    public QuestionDTO toQuestionDTO(AssignmentQuestionEntity assignmentQuestionEntity) {
        Question question = assignmentQuestionEntity.getQuestion();

        List<AnswerDTO> answerDTOList = null;
        if (question.getAnswerList() != null) {
            answerDTOList = question.getAnswerList().stream()
                    .map(answerMapper::toAnswerDTO)
                    .toList();
        }

        return QuestionDTO.builder()
                .questionId(question.getQuestionId())
                .questionOrder(assignmentQuestionEntity.getQuestionOrder())
                .questionContent(question.getQuestionContent())
                .answerList(answerDTOList)
                .build();
    }

}

