package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassroomRepository extends JpaRepository<ClassroomEntity, String> {
    Optional<ClassroomEntity> findById (String classroomId);
    Page<ClassroomEntity> findByTeacher(UserEntity teacher, Pageable pageable);
    Page<ClassroomEntity> findByStudentListContaining(UserEntity student, Pageable pageable);
    Page<ClassroomEntity> findByClassroomNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<ClassroomEntity> findByTeacherAndClassroomNameContainingIgnoreCase(UserEntity teacher, String keyword, Pageable pageable);

    Page<ClassroomEntity> findByStudentList(UserEntity student, Pageable pageable);

    @Query("SELECT c FROM ClassroomEntity c " +
            "JOIN ClassroomStudentEntity cs ON cs.classroomEntity = c " +
            "WHERE cs.userEntity = :student " +
            "AND LOWER(c.classroomName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClassroomEntity> findByStudentAndClassroomNameContainingIgnoreCase(UserEntity student, String keyword, Pageable pageable);


}
