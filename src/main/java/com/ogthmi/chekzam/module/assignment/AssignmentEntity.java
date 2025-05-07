package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentType;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
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
public class AssignmentEntity {
    @Id
    @Column(nullable = false, unique = true)
    private String assignmentId;

    @Column(nullable = false)
    private String assignmentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AssignmentType assignmentType;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private UserEntity teacher;

    @OneToMany(mappedBy = "assignmentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionOrder")
    private List<AssignmentQuestionEntity> questionList;


    @OneToMany(mappedBy = "assignmentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentClassroomEntity> classroomList;


    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        if (this.assignmentId == null) {
            this.assignmentId = IdGenerator.generateRandomId();
        }
        if (this.createdAt == null){
            this.createdAt = LocalDateTime.now();
        }
    }
}
