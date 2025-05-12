package com.ogthmi.chekzam.module.answer;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.submission_answer.dto.AnswerDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final AnswerMapper answerMapper;

    public List<AnswerEntity> processAnswers(List<AnswerDTO> answerDTOs, QuestionEntity questionEntity) {
        List<AnswerEntity> existingAnswers = questionEntity.getAnswerEntityList();
        Map<String, AnswerEntity> existingAnswerMap = existingAnswers.stream()
                .filter(a -> a.getAnswerId() != null)
                .collect(Collectors.toMap(AnswerEntity::getAnswerId, a -> a));

        List<AnswerEntity> updatedAnswers = new ArrayList<>();
        int order = 1;

        for (AnswerDTO dto : answerDTOs) {
            AnswerEntity answer;
            if (dto.getAnswerId() != null && existingAnswerMap.containsKey(dto.getAnswerId())) {
                answer = existingAnswerMap.get(dto.getAnswerId());
                answer.setAnswerContent(dto.getAnswerContent());
                answer.setCorrect(dto.isCorrect());
            } else {
                answer = answerMapper.toAnswer(dto);
                answer.setQuestionEntity(questionEntity);
            }

            answer.setAnswerOrder(order++);
            updatedAnswers.add(answer);
        }

        Set<String> updatedIds = updatedAnswers.stream()
                .map(AnswerEntity::getAnswerId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<AnswerEntity> toRemove = existingAnswers.stream()
                .filter(a -> a.getAnswerId() != null && !updatedIds.contains(a.getAnswerId()))
                .toList();

        existingAnswers.removeAll(toRemove);

        for (AnswerEntity updated : updatedAnswers) {
            if (!existingAnswers.contains(updated)) {
                existingAnswers.add(updated);
            }
        }

        return existingAnswers;
    }

    public List<AnswerEntity> findCorrectAnswersByQuestion(String questionId) {
        return answerRepository.findByQuestionEntity_QuestionIdAndIsCorrectTrue(questionId);
    }

    public AnswerEntity findById(String answerId) {
        return answerRepository.findById(answerId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.ANSWER_NOT_FOUND));
    }

    public void validateAnswerList(List<AnswerDTO> answerList) {
        if (answerList == null || answerList.isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_EMPTY);
        }

        for (AnswerDTO answer : answerList) {
            if (answer.getAnswerContent() == null || answer.getAnswerContent().isBlank()) {
                throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
            }
        }
    }

    public void ensureHasCorrectAnswer(List<AnswerDTO> answerList) {
        boolean hasCorrect = answerList.stream().anyMatch(AnswerDTO::isCorrect);
        if (!hasCorrect) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_CORRECT_ANSWER_NOT_FOUND);
        }
    }
}
