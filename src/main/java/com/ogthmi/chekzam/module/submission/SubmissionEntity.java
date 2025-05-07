//package com.ogthmi.chekzam.module.submission;
//
//import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
//import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
//import com.ogthmi.chekzam.module.user.UserEntity;
//import com.ogthmi.chekzam.common.util.IdGenerator;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "submission")
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Data
//public class SubmissionEntity {
//    @Id
//    @Column(nullable = false)
//    private String submissionId;
//
//    @ManyToOne
//    @JoinColumn(name = "assignment_id", nullable = false)
//    private AssignmentEntity assignmentEntity;
//
//    @ManyToOne
//    @JoinColumn(name = "classroom_id", nullable = false)
//    private ClassroomEntity classroomEntity;
//
//    @JoinColumn(name = "student_id", nullable = false)
//    @ManyToOne
//    private UserEntity student;
//
//    @Column(nullable = false)
//    private LocalDateTime startedAt;
//
//    @Column(nullable = false)
//    private LocalDateTime submittedAt;
//
//    @Column(nullable = false)
//    private Long durationInSeconds;
//
//    @PrePersist
//    public void prePersist() {
//        if (this.submissionId == null) {
//            this.submissionId = IdGenerator.generateRandomId();
//        }
//        if (startedAt != null && submittedAt != null) {
//            this.durationInSeconds = java.time.Duration.between(startedAt, submittedAt).getSeconds();
//        }
//    }
//
//    private Double grade;
//
//    private Boolean graded;
//}
