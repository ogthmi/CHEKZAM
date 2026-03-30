package com.ogthmi.chekzam.module.answer;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.question.QuestionEntity;
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

        if (questionEntity == null) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_NOT_FOUND);
        }

        if (answerDTOs == null || answerDTOs.isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
        }
        // Map các Answer hiện có (nếu có) từ questionEntity
        Map<String, AnswerEntity> existingAnswerMap = Optional.ofNullable(questionEntity.getAnswerEntityList())
                .orElse(Collections.emptyList())
                .stream()
                .filter(a -> a.getAnswerId() != null)
                .collect(Collectors.toMap(AnswerEntity::getAnswerId, a -> a));

        List<AnswerEntity> updatedAnswers = new ArrayList<>();

        int order = 1;

        for (AnswerDTO dto : answerDTOs) {
            AnswerEntity answer;

            // Nếu có answerId trùng với answer cũ => update
            if (dto.getAnswerId() != null && existingAnswerMap.containsKey(dto.getAnswerId())) {
                answer = existingAnswerMap.get(dto.getAnswerId());
                answer.setAnswerContent(dto.getAnswerContent());
                answer.setCorrect(dto.isCorrect());
            } else {
                // Tạo mới
                answer = answerMapper.toAnswer(dto);
            }

            answer.setQuestionEntity(questionEntity); // Gán đúng câu hỏi
            answer.setAnswerOrder(order++);
            updatedAnswers.add(answer);
        }

        // Gán danh sách mới cho questionEntity (cần thiết để Hibernate cascade)
        questionEntity.getAnswerEntityList().clear();
        questionEntity.getAnswerEntityList().addAll(updatedAnswers);


        return updatedAnswers;
    }

    public AnswerEntity findById(String answerId) {
        return answerRepository.findById(answerId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.ANSWER_NOT_FOUND));
    }

}
