package com.ogthmi.chekzam.module.assignment;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    Page<Assignment> findByTeacher(UserEntity teacher, String keyword, Pageable pageable);
    Page<Assignment> findByTeacherAndAssignmentNameContainingIgnoreCase(UserEntity teacher, String keyword, Pageable pageable);
    Page<Assignment> findByClassroomList_ClassroomId(String classroomId, Pageable pageable);
    Page<Assignment> findByClassroomList_ClassroomIdAndAssignmentNameContainingIgnoreCase(String classroomId, String keyword, Pageable pageable);

}
