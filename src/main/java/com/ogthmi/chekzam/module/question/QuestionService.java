package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.answer.AnswerMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;

    public QuestionEntity saveQuestionWithAnswer(QuestionDTO questionRequest) {
        QuestionEntity questionEntity = questionMapper.toQuestion(questionRequest);
        if (questionEntity.getAnswerEntityList() == null || questionEntity.getAnswerEntityList().isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
        }
        int order = 1;
        for (AnswerEntity answerEntity : questionEntity.getAnswerEntityList()) {
            answerEntity.setQuestionEntity(questionEntity);
            answerEntity.setAnswerOrder(order++);
        }
        return questionRepository.save(questionEntity);
    }

    public void updateQuestionWithAnswer(QuestionDTO questionDTO) {
        QuestionEntity questionEntity;

        if (questionDTO.getQuestionId() != null) {
            // Cập nhật câu hỏi cũ
            questionEntity = questionRepository.findById(questionDTO.getQuestionId())
                    .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.QUESTION_NOT_FOUND));
            questionEntity.setQuestionContent(questionDTO.getQuestionContent());
        } else {
            // Tạo mới câu hỏi
            questionEntity = new QuestionEntity();
            questionEntity.setQuestionContent(questionDTO.getQuestionContent());
            questionEntity.setAnswerEntityList(new ArrayList<>());
        }

        List<AnswerEntity> currentAnswers = questionEntity.getAnswerEntityList();
        Map<String, AnswerEntity> currentAnswerMap = currentAnswers.stream()
                .filter(a -> a.getAnswerId() != null)
                .collect(Collectors.toMap(AnswerEntity::getAnswerId, a -> a));

        List<AnswerEntity> updatedAnswers = new ArrayList<>();
        int order = 1;

        for (AnswerDTO answerDTO : questionDTO.getAnswerList()) {
            AnswerEntity answer;

            if (answerDTO.getAnswerId() != null && currentAnswerMap.containsKey(answerDTO.getAnswerId())) {
                // Cập nhật đáp án cũ
                answer = currentAnswerMap.get(answerDTO.getAnswerId());
                answer.setAnswerContent(answerDTO.getAnswerContent());
                answer.setCorrect(answerDTO.isCorrect());
            } else {
                // Tạo mới đáp án
                answer = answerMapper.toAnswer(answerDTO); // Mapper không nên set ID
                answer.setQuestionEntity(questionEntity);  // gắn quan hệ 2 chiều
            }

            answer.setAnswerOrder(order++);
            updatedAnswers.add(answer);
        }

        // Xoá đáp án cũ không còn trong danh sách mới
        Set<String> updatedIds = updatedAnswers.stream()
                .map(AnswerEntity::getAnswerId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<AnswerEntity> toRemove = currentAnswers.stream()
                .filter(a -> a.getAnswerId() != null && !updatedIds.contains(a.getAnswerId()))
                .toList();

        currentAnswers.removeAll(toRemove);

        // Thêm hoặc cập nhật đáp án
        for (AnswerEntity updated : updatedAnswers) {
            if (!currentAnswers.contains(updated)) {
                currentAnswers.add(updated);
            }
        }

        questionEntity.setAnswerEntityList(currentAnswers);

        questionRepository.save(questionEntity);
    }

    public void deleteQuestion (QuestionEntity questionEntity){
        questionRepository.delete(questionEntity);
    }
}
