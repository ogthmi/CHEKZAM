package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomId;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentClassroomRepository extends JpaRepository <AssignmentClassroomEntity, AssignmentClassroomId> {
    Page<AssignmentClassroomEntity> findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomNameContainingIgnoreCase(String assignmentId, String classroomName, Pageable pageable);
    Page<AssignmentClassroomEntity> findByClassroomEntity_ClassroomIdAndAssignmentEntity_AssignmentNameContainingIgnoreCase(String classroomId, String assignmentName, Pageable pageable);
    void deleteByAssignmentEntityAndClassroomEntity(AssignmentEntity assignmentEntity, ClassroomEntity classroomEntity);
    boolean existsByAssignmentEntityAndClassroomEntity(AssignmentEntity assignmentEntity, ClassroomEntity classroomEntity);
}
