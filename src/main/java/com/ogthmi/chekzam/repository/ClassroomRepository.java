package com.ogthmi.chekzam.repository;

import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    Optional<Classroom> findById (String classroomId);
    Page<Classroom> findByTeacher(User teacher, Pageable pageable);
    Page<Classroom> findByStudentsContaining (User student, Pageable pageable);
    Page<Classroom> findByClassroomNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Classroom> findByTeacherAndClassroomNameContainingIgnoreCase(User teacher, String keyword, Pageable pageable);
    Page<Classroom> findByStudentsContainingAndClassroomNameContainingIgnoreCase(User student, String keyword, Pageable pageable);

}
