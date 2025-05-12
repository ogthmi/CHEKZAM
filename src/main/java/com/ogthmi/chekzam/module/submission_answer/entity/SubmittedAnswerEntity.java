package com.ogthmi.chekzam.module.submission_answer.entity;

import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.submission.SubmissionEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submission_answers")
@IdClass(SubmittedAnswerId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmittedAnswerEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private SubmissionEntity submission;

    @Id
    @ManyToOne
    @JoinColumn(name = "selected_answer_id", nullable = false)
    private AnswerEntity selectedAnswer;

    @Id
    @Column(name = "question_id", nullable = false)
    private String questionId;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "assignment_id", referencedColumnName = "assignment_id", insertable = false, updatable = false),
            @JoinColumn(name = "question_id", referencedColumnName = "question_id", insertable = false, updatable = false)
    })
    private AssignmentQuestionEntity assignmentQuestion;

    // Trường này cần để join ở trên hoạt động
    @Column(name = "assignment_id", nullable = false)
    private String assignmentId;
}

