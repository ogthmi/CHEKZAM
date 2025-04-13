package com.ogthmi.chekzam.entity;

import com.ogthmi.chekzam.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "classrooms")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Classroom {
    @Id
    @Column(nullable = false, unique = true)
    private String classroomId;

    @Column(nullable = false)
    private String classroomName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinTable(
            name = "classroom_students",
            joinColumns = @JoinColumn(name = "classroom_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> students = new HashSet<>();

    private LocalDateTime createdAt;

    @PrePersist
    public void generateId() {
        if (this.classroomId == null) {
            this.classroomId = IdGenerator.generateRandomId();
        }
    }
}
