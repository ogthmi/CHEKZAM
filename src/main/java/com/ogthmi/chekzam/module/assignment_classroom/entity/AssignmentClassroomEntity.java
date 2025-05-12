package com.ogthmi.chekzam.module.assignment_classroom.entity;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_classrooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(AssignmentClassroomId.class)
public class AssignmentClassroomEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private AssignmentEntity assignmentEntity;

    @Id
    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private ClassroomEntity classroomEntity;

    private LocalDateTime assignedTime;
    @PrePersist
    public void prePersist() {
        if (this.assignedTime == null) {
            this.assignedTime = LocalDateTime.now();
        }
    }

    private int duration; //MINUTES
    private int maxAttempts;
    private boolean isShuffleEnable;

    private LocalDateTime openTime;
    private LocalDateTime dueTime;
}
