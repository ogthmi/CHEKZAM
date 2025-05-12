package com.ogthmi.chekzam.module.assignment_question;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.question.QuestionService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AssignmentQuestionService {
    private final QuestionService questionService;
    private final AssignmentQuestionRepository assignmentQuestionRepository;

    @Transactional
    public void attachQuestionsToAssignment(AssignmentEntity assignmentEntity, List<QuestionDTO<AnswerDTO>> questionList) {
        int order = 1;
        for (QuestionDTO<AnswerDTO> questionRequest : questionList) {
            QuestionEntity questionEntity = questionService.saveQuestionWithAnswer(questionRequest);
            AssignmentQuestionEntity assignmentQuestion = AssignmentQuestionEntity.builder()
                    .assignmentEntity(assignmentEntity)
                    .questionEntity(questionEntity)
                    .questionOrder(order++)
                    .build();
            assignmentQuestionRepository.save(assignmentQuestion);
        }
    }

    public List<QuestionEntity> extractAllQuestions(AssignmentEntity assignment) {
        return assignment.getQuestionList().stream()
                .map(AssignmentQuestionEntity::getQuestionEntity)
                .toList();
    }
}

