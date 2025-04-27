package com.ogthmi.chekzam.repository;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.entity.assignment.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    public Page<Assignment> findByTeacher(User teacher, String keyword, Pageable pageable);
    public Page<Assignment> findByTeacherAndAssignmentNameContainingIgnoreCase(User teacher, String keyword, Pageable pageable);
}
