package com.ogthmi.chekzam.entity.assignment;

import com.ogthmi.chekzam.util.IdGenerator;
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
    private List<Answer> answerList;

    @PrePersist
    public void generatedId() {
        if (this.questionId == null) {
            this.questionId = IdGenerator.generateRandomId();
        }
    }
}

