package com.ogthmi.chekzam.module.submission_answer.service;

import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.submission.SubmissionEntity;
import com.ogthmi.chekzam.module.submission.SubmissionRepository;
import com.ogthmi.chekzam.module.submission_answer.SubmissionAnswerRepository;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GradingAnswerService {
    private final SubmissionAnswerRepository submittedAnswerRepository;
    private final SubmissionRepository submissionRepository;

    public int gradeSubmission(SubmissionEntity submission) {
        List<SubmittedAnswerEntity> submittedAnswerList = submittedAnswerRepository.findBySubmission(submission);
        return countCorrectQuestions(submittedAnswerList);
    }

    @Transactional
    public void updateCorrectAnswers(SubmissionEntity submission) {
        int correctCount = gradeSubmission(submission);
        submission.setTotalCorrectQuestions(correctCount);
        submissionRepository.save(submission);
    }

    private int countCorrectQuestions(List<SubmittedAnswerEntity> submittedAnswerList) {
        Map<String, List<SubmittedAnswerEntity>> groupedByQuestion = submittedAnswerList.stream()
                .collect(Collectors.groupingBy(answer -> answer.getAssignmentQuestion().getQuestionEntity().getQuestionId()));

        int correctCount = 0;
        for (List<SubmittedAnswerEntity> answers : groupedByQuestion.values()) {
            if (isQuestionCorrect(answers)) {
                correctCount++;
            }
        }
        return correctCount;
    }

    private boolean isQuestionCorrect(List<SubmittedAnswerEntity> answersForQuestion) {
        Set<String> correctAnswerIdList = getCorrectAnswerIdList(answersForQuestion.getFirst().getAssignmentQuestion().getQuestionEntity());
        Set<String> selectedAnswerIdList = answersForQuestion.stream()
                .map(answer -> answer.getSelectedAnswer().getAnswerId())
                .collect(Collectors.toSet());
        return selectedAnswerIdList.equals(correctAnswerIdList);
    }

    private Set<String> getCorrectAnswerIdList(QuestionEntity question) {
        return question.getAnswerEntityList().stream()
                .filter(AnswerEntity::isCorrect)
                .map(AnswerEntity::getAnswerId)
                .collect(Collectors.toSet());
    }
}
