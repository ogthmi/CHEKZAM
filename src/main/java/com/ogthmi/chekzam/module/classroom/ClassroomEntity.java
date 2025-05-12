package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.common.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classroom")
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

    @OneToMany(mappedBy = "classroomEntity", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ClassroomStudentEntity> studentList = new ArrayList<>();

    @OneToMany(mappedBy = "classroomEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentClassroomEntity> assignmentList = new ArrayList<>();

    @PrePersist
    public void generateId() {
        if (this.classroomId == null) {
            this.classroomId = IdGenerator.generateRandomId();
        }
    }
}
