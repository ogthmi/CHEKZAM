package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.Answer;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import lombok.AllArgsConstructor;
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

    public void deleteQuestion (Question question){
        questionRepository.delete(question);
    }
}
