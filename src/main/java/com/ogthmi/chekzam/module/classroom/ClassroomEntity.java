package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.assignment.Assignment;
import com.ogthmi.chekzam.common.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "classroomEntity")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ClassroomEntity {
    @Id
    @Column(nullable = false, unique = true)
    private String classroomId;

    @Column(nullable = false)
    private String classroomName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private UserEntity teacher;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "classroom_students",
            joinColumns = @JoinColumn(name = "classroom_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserEntity> students = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "assignment_classrooms",
            joinColumns = @JoinColumn(name = "classroom_id"),
            inverseJoinColumns = @JoinColumn(name = "assignment_id")
    )
    private Set<Assignment> assignments = new HashSet<>();

    private List<AssignmentClassroomEntity> assignmentList;

    @PrePersist
    public void generateId() {
        if (this.classroomId == null) {
            this.classroomId = IdGenerator.generateRandomId();
        }
    }
}
