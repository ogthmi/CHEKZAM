package com.ogthmi.chekzam.module.assignment_question;

import com.ogthmi.chekzam.module.assignment.Assignment;
import com.ogthmi.chekzam.module.question.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assignment_questions")
@IdClass(AssignmentQuestionId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentQuestionEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Id
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "question_order")
    private int questionOrder;
}


