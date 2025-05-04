package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentType;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.common.util.IdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "assignment")
public class Assignment {
    @Id
    @Column(nullable = false, unique = true)
    private String assignmentId;

    @Column
    private String assignmentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private AssignmentType assignmentType;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private UserEntity teacher;

    @Column
    private int duration; //minutes

    @Column
    private int maxAttempts;

    @Column
    private LocalDateTime startTime;

    @Column
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionOrder")
    private List<AssignmentQuestionEntity> questionList;


    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentClassroomEntity> classroomList;



    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void generatedId(){
        if (this.assignmentId == null) {
            this.assignmentId = IdGenerator.generateRandomId();
        }
    }
}
