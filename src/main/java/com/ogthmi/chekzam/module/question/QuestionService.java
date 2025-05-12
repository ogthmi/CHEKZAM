package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.answer.AnswerService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;
    private final AnswerService answerService;

    public void validateQuestion(QuestionDTO<AnswerDTO> question) {
        if (question.getQuestionContent() == null || question.getQuestionContent().isBlank()) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_CONTENT_EMPTY);
        }
        if (question.getAnswerList() == null || question.getAnswerList().isEmpty()){
            throw new ApplicationException(ExceptionMessageCode.QUESTION_EMPTY);
        }
        boolean hasCorrectAnswer = false;
        for (AnswerDTO answerDTO: question.getAnswerList()){
            if (answerDTO.getAnswerContent() == null || answerDTO.getAnswerContent().isEmpty()){
                throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
            }
            if (answerDTO.isCorrect()) hasCorrectAnswer = true;
        }
        if (!hasCorrectAnswer){
            throw new ApplicationException(ExceptionMessageCode.QUESTION_CORRECT_ANSWER_NOT_FOUND);
        }
    }

    public QuestionEntity findQuestionById(String questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.QUESTION_NOT_FOUND));
    }

    @Transactional
    public QuestionEntity saveQuestionWithAnswer(QuestionDTO<AnswerDTO> questionDTO) {
        QuestionEntity question = questionMapper.toQuestion(questionDTO);
        question.getAnswerEntityList().forEach(dto -> {
            System.out.println("Answer Content: " + dto.getAnswerContent() + ", isCorrect: " + dto.isCorrect());
        });
        if (questionDTO.getAnswerList() == null || questionDTO.getAnswerList().isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
        }

        List<AnswerEntity> processedAnswers = answerService.processAnswers(questionDTO.getAnswerList(), question);
        question.setAnswerEntityList(processedAnswers);

        return questionRepository.save(question);
    }

    public void deleteQuestion(QuestionEntity questionEntity) {
        questionRepository.delete(questionEntity);
    }
}
