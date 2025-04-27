package com.ogthmi.chekzam.entity.assignment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "assignment_questions")
@IdClass(AssignmentQuestionId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentQuestion {

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


