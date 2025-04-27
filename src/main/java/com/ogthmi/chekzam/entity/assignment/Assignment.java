package com.ogthmi.chekzam.entity.assignment;

import com.ogthmi.chekzam.constant.AssignmentType;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.util.IdGenerator;
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
    private User teacher;

    @Column
    private int duration; //minutes

    @Column
    private int maxAttempts;

    @Column
    private LocalDateTime startTime;

    @Column
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentQuestion> questionList;


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "assignment_classrooms",
            joinColumns = @JoinColumn(name = "assignment_id"),
            inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    private List<Classroom> classroomList;



    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void generatedId(){
        if (this.assignmentId == null) {
            this.assignmentId = IdGenerator.generateRandomId();
        }
    }
}
