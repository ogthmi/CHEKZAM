package com.ogthmi.chekzam.module.assignment;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<AssignmentEntity, String> {
    Page<AssignmentEntity> findByTeacher(UserEntity teacher, String keyword, Pageable pageable);
    Page<AssignmentEntity> findByTeacherAndAssignmentNameContainingIgnoreCase(UserEntity teacher, String keyword, Pageable pageable);
    Page<AssignmentEntity> findByClassroomList_ClassroomEntity_ClassroomId(String classroomId, Pageable pageable);
    Page<AssignmentEntity> findByClassroomList_ClassroomEntity_ClassroomIdAndAssignmentNameContainingIgnoreCase(String classroomId, String keyword, Pageable pageable);

}
