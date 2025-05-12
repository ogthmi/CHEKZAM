package com.ogthmi.chekzam.module.classroom_student;

import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentId;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface ClassroomStudentRepository extends JpaRepository<ClassroomStudentEntity, ClassroomStudentId> {
    Optional<ClassroomStudentEntity> findByClassroomEntityAndUserEntity(ClassroomEntity classroom, UserEntity user);
    List<ClassroomStudentEntity> findByClassroomEntity(ClassroomEntity classroom);
    boolean existsByClassroomEntityAndUserEntity(ClassroomEntity classroom, UserEntity user);
    boolean existsByClassroomEntity_ClassroomIdAndUserEntity_UserId (String classroomId, String userId);
}
