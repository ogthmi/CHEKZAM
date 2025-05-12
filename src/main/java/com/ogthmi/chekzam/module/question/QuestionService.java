package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.submission_answer.dto.AnswerDTO;
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

    public void validateQuestionList(List<QuestionDTO<AnswerDTO>> questionList) {
        if (questionList == null || questionList.isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_EMPTY);
        }

        for (QuestionDTO<AnswerDTO> question : questionList) {
            validateQuestionContent(question);
            answerService.validateAnswerList(question.getAnswerList());
            answerService.ensureHasCorrectAnswer(question.getAnswerList());
        }
    }

    private void validateQuestionContent(QuestionDTO<AnswerDTO> question) {
        if (question.getQuestionContent() == null || question.getQuestionContent().isBlank()) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_CONTENT_EMPTY);
        }
    }

    public QuestionEntity findQuestionById(String questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.QUESTION_NOT_FOUND));
    }

    @Transactional
    public QuestionEntity saveQuestionWithAnswer(QuestionDTO<AnswerDTO> questionDTO) {
        QuestionEntity question = questionMapper.toQuestion(questionDTO);
        if (questionDTO.getAnswerList() == null || questionDTO.getAnswerList().isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
        }

        List<AnswerEntity> processedAnswers = answerService.processAnswers(questionDTO.getAnswerList(), question);
        question.setAnswerEntityList(processedAnswers);

        return questionRepository.save(question);
    }

    @Transactional
    public void updateQuestionWithAnswer(QuestionDTO<AnswerDTO> questionDTO) {
        QuestionEntity question;

        if (questionDTO.getQuestionId() != null) {
            question = findQuestionById(questionDTO.getQuestionId());
            question.setQuestionContent(questionDTO.getQuestionContent());
        } else {
            question = new QuestionEntity();
            question.setQuestionContent(questionDTO.getQuestionContent());
            question.setAnswerEntityList(new ArrayList<>());
        }

        List<AnswerEntity> updatedAnswers = answerService.processAnswers(questionDTO.getAnswerList(), question);
        question.setAnswerEntityList(updatedAnswers);

        questionRepository.save(question);
    }

    public void deleteQuestion(QuestionEntity questionEntity) {
        questionRepository.delete(questionEntity);
    }
}
