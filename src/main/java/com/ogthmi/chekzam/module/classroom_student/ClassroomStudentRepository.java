package com.ogthmi.chekzam.module.classroom_student;

import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentId;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface ClassroomStudentRepository extends JpaRepository<ClassroomStudentEntity, ClassroomStudentId> {
    Optional<ClassroomStudentEntity> findByClassroomEntityAndUserEntity(ClassroomEntity classroom, UserEntity user);
    List<ClassroomStudentEntity> findByClassroomEntity(ClassroomEntity classroom);
    List<ClassroomStudentEntity> findByUserEntity(UserEntity user);
    Page<ClassroomStudentEntity> findByClassroomEntity(ClassroomEntity classroom, Pageable pageable);
    Page<ClassroomStudentEntity> findByUserEntity(UserEntity user, Pageable pageable);
    Page<ClassroomStudentEntity> findByUserEntityAndClassroomEntity_ClassroomNameContainingIgnoreCase(
            UserEntity user, String keyword, Pageable pageable);

    void deleteByClassroomEntity(ClassroomEntity classroom);
    void deleteByUserEntity(UserEntity user);
    boolean existsByClassroomEntityAndUserEntity(ClassroomEntity classroom, UserEntity user);
}
