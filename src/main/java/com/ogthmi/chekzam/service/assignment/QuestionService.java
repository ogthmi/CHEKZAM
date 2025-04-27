package com.ogthmi.chekzam.service.assignment;

import com.ogthmi.chekzam.dto.assignment.core.QuestionDTO;
import com.ogthmi.chekzam.entity.assignment.Answer;
import com.ogthmi.chekzam.entity.assignment.Assignment;
import com.ogthmi.chekzam.entity.assignment.Question;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.QuestionMapper;
import com.ogthmi.chekzam.repository.QuestionRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    public Question saveQuestionWithAnswer(QuestionDTO questionRequest) {
        Question question = questionMapper.toQuestion(questionRequest);
        if (question.getAnswerList() == null || question.getAnswerList().isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
        }
        int order = 1;
        for (Answer answer : question.getAnswerList()) {
            answer.setQuestion(question);
            answer.setAnswerOrder(order++);
        }
        return questionRepository.save(question);
    }
}
