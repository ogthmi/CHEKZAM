package com.ogthmi.chekzam.module.question;

import com.ogthmi.chekzam.module.answer.Answer;
import com.ogthmi.chekzam.common.util.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "question")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Question {
    @Id
    @Column(name = "question_id", nullable = false)
    private String questionId;

    @Column(columnDefinition = "TEXT")
    private String questionContent;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("answerOrder")
    private List<Answer> answerList;

    @PrePersist
    public void generatedId() {
        if (this.questionId == null) {
            this.questionId = IdGenerator.generateRandomId();
        }
    }
}

