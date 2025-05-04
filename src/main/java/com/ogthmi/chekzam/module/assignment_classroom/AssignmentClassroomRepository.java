package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.Assignment;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentClassroomRepository extends JpaRepository <AssignmentClassroomEntity, AssignmentClassroomId> {
    Page<AssignmentClassroomEntity> findByAssignment_AssignmentIdAndClassroom_ClassroomNameContainingIgnoreCase(Assignment assignment, Pageable pageable);
    Page<AssignmentClassroomEntity> findByClassroom_ClassroomIdAndAssignment_AssignmentNameContainingIgnoreCase(ClassroomEntity classroomEntity, Pageable pageable);
    void deleteByAssignmentAndClassroom (Assignment assignment, ClassroomEntity classroomEntity);
}
