package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentStatus;
import com.ogthmi.chekzam.module.assignment.Assignment;
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
@IdClass(AssignmentClassroomEntity.class)
public class AssignmentClassroomEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

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

    private LocalDateTime openTime;
    private LocalDateTime dueTime;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    public AssignmentStatus getDynamicStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (dueTime != null && now.isAfter(dueTime)) {
            return AssignmentStatus.CLOSED;
        }

        if (openTime != null && now.isBefore(openTime)) {
            return AssignmentStatus.NOT_YET_OPENED;
        }

        return AssignmentStatus.OPEN;
    }
}
