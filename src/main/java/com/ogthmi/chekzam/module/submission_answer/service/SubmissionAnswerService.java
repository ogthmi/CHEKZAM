package com.ogthmi.chekzam.module.submission_answer.service;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.answer.AnswerService;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.submission.SubmissionEntity;
import com.ogthmi.chekzam.module.submission_answer.SubmissionAnswerRepository;
import com.ogthmi.chekzam.module.submission_answer.dto.GradedAnswerResponse;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerEntity;
import com.ogthmi.chekzam.module.submission_answer.dto.QuestionAnswerSelectionRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SubmissionAnswerService {
    private final SubmissionAnswerRepository submittedAnswerRepository;
    private final AnswerService answerService;

    @Transactional
    public void saveSubmittedAnswers(SubmissionEntity submission, List<QuestionAnswerSelectionRequest> studentAnswers) {
        List<SubmittedAnswerEntity> submittedAnswersToSave = new ArrayList<>();

        for (QuestionAnswerSelectionRequest request : studentAnswers) {
            String questionId = request.getQuestionId();
            Set<String> selectedAnswerIds = request.getSelectedAnswerIdSet();

            AssignmentQuestionEntity assignmentQuestion = extractAssignmentQuestionFromSubmission(submission, questionId);
            validateSelectedAnswers(assignmentQuestion.getQuestionEntity(), selectedAnswerIds);

            List<SubmittedAnswerEntity> submittedAnswers = buildSubmittedAnswerEntityList(
                    submission, assignmentQuestion, selectedAnswerIds
            );
            submittedAnswersToSave.addAll(submittedAnswers);
        }

        submittedAnswerRepository.saveAll(submittedAnswersToSave);
    }

    private AssignmentQuestionEntity extractAssignmentQuestionFromSubmission(SubmissionEntity submission, String questionId) {
        return submission.getAssignmentClassroom()
                .getAssignmentEntity()
                .getQuestionList().stream()
                .filter(aq -> aq.getQuestionEntity().getQuestionId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.QUESTION_NOT_FOUND));
    }

    private void validateSelectedAnswers(QuestionEntity question, Set<String> selectedAnswerIds) {
        Set<String> validAnswerIds = question.getAnswerEntityList().stream()
                .map(AnswerEntity::getAnswerId)
                .collect(Collectors.toSet());

        for (String answerId : selectedAnswerIds) {
            if (!validAnswerIds.contains(answerId)) {
                throw new ApplicationException(ExceptionMessageCode.ANSWER_NOT_BELONG_TO_QUESTION);
            }
        }
    }

    private List<SubmittedAnswerEntity> buildSubmittedAnswerEntityList(
            SubmissionEntity submission, AssignmentQuestionEntity assignmentQuestion, Set<String> selectedAnswerIds) {

        return selectedAnswerIds.stream()
                .map(answerId -> {
                    AnswerEntity selectedAnswer = answerService.findById(answerId);
                    return SubmittedAnswerEntity.builder()
                            .submission(submission)
                            .assignmentQuestion(assignmentQuestion)
                            .selectedAnswer(selectedAnswer)
                            .assignmentId(assignmentQuestion.getAssignmentEntity().getAssignmentId())
                            .questionId(assignmentQuestion.getQuestionEntity().getQuestionId())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public QuestionDTO<GradedAnswerResponse> convertToGradedQuestionResponse(
            AssignmentQuestionEntity assignmentQuestion,
            List<SubmittedAnswerEntity> submittedAnswerListForQuestion) {

        QuestionEntity question = assignmentQuestion.getQuestionEntity();

        Set<String> selectedAnswerIdSet = submittedAnswerListForQuestion.stream()
                .map(sub -> sub.getSelectedAnswer().getAnswerId())
                .collect(Collectors.toSet());

        List<GradedAnswerResponse> answerList = question.getAnswerEntityList().stream()
                .map(answerEntity -> GradedAnswerResponse.builder()
                        .answerId(answerEntity.getAnswerId())
                        .answerOrder(answerEntity.getAnswerOrder())
                        .answerContent(answerEntity.getAnswerContent())
                        .isCorrect(answerEntity.isCorrect())
                        .isSelectedByStudent(selectedAnswerIdSet.contains(answerEntity.getAnswerId()))
                        .build())
                .collect(Collectors.toList());

        return QuestionDTO.<GradedAnswerResponse>builder()
                .questionId(question.getQuestionId())
                .questionOrder(assignmentQuestion.getQuestionOrder())
                .questionContent(question.getQuestionContent())
                .answerList(answerList)
                .build();
    }
}

