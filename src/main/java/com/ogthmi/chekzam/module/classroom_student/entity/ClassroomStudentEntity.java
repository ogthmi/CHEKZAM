package com.ogthmi.chekzam.module.classroom_student.entity;

import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "classroom_students")
@IdClass(ClassroomStudentId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassroomStudentEntity {
    @Id
    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private ClassroomEntity classroomEntity;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;
}
