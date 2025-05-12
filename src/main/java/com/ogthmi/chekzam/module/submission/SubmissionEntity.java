package com.ogthmi.chekzam.module.submission;

import com.ogthmi.chekzam.common.util.IdGenerator;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "submission")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SubmissionEntity {
    @Id
    @Column(nullable = false)
    private String submissionId;
    @PrePersist
    public void prePersist () {
        if (submissionId == null){
            this.submissionId = IdGenerator.generateRandomId();
        }
    }

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "assignment_id", nullable = false),
            @JoinColumn(name = "classroom_id", nullable = false)
    })
    private AssignmentClassroomEntity assignmentClassroom;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private UserEntity student;

    @Column(nullable = false)
    private int takingAttempt;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @Column(nullable = false)
    private Long durationInSeconds;
    public void calculateDuration(){
        if (startedAt != null && submittedAt != null) {
            durationInSeconds = java.time.Duration.between(startedAt, submittedAt).getSeconds();
        }
    }

    private int totalCorrectQuestions;

    @OneToMany (mappedBy = "submission", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    private List<SubmittedAnswerEntity> gradedAnswerEntityList;
}
