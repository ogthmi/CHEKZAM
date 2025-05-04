package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<ClassroomEntity, String> {
    Optional<ClassroomEntity> findById (String classroomId);
    Page<ClassroomEntity> findByTeacher(UserEntity teacher, Pageable pageable);
    Page<ClassroomEntity> findByStudentsContaining (UserEntity student, Pageable pageable);
    Page<ClassroomEntity> findByClassroomNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<ClassroomEntity> findByTeacherAndClassroomNameContainingIgnoreCase(UserEntity teacher, String keyword, Pageable pageable);
    Page<ClassroomEntity> findByStudentsContainingAndClassroomNameContainingIgnoreCase(UserEntity student, String keyword, Pageable pageable);
}
