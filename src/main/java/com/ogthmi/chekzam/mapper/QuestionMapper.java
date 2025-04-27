package com.ogthmi.chekzam.mapper;

import com.ogthmi.chekzam.dto.assignment.core.AnswerDTO;
import com.ogthmi.chekzam.dto.assignment.core.QuestionDTO;
import com.ogthmi.chekzam.entity.assignment.Answer;
import com.ogthmi.chekzam.entity.assignment.AssignmentQuestion;
import com.ogthmi.chekzam.entity.assignment.Question;
import lombok.AllArgsConstructor;
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

    public QuestionDTO toQuestionDTO(AssignmentQuestion assignmentQuestion) {
        Question question = assignmentQuestion.getQuestion();

        List<AnswerDTO> answerDTOList = null;
        if (question.getAnswerList() != null) {
            answerDTOList = question.getAnswerList().stream()
                    .map(answerMapper::toAnswerDTO)
                    .toList();
        }

        return QuestionDTO.builder()
                .questionId(question.getQuestionId())
                .questionOrder(assignmentQuestion.getQuestionOrder())
                .questionContent(question.getQuestionContent())
                .answerList(answerDTOList)
                .build();
    }

}

