package com.ogthmi.chekzam.entity.assignment;

import com.ogthmi.chekzam.util.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "answer")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Answer {
    @Id
    @Column(name = "answer_id", nullable = false)
    private String answerId;

    @Column(name = "answer_content", columnDefinition = "TEXT", nullable = false)
    private String answerContent;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "answer_order")
    private int answerOrder;


    @PrePersist
    public void generateId() {
        if (this.answerId == null) {
            this.answerId = IdGenerator.generateRandomId();
        }
    }
}
