package com.ogthmi.chekzam.module.submission;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository <SubmissionEntity, String> {
    int countByAssignmentClassroomAndStudent(AssignmentClassroomEntity assignmentClassroomEntity, UserEntity student);
    Page<SubmissionEntity> findByAssignmentClassroom (AssignmentClassroomEntity assignmentClassroom, Pageable pageable);
    Page<SubmissionEntity> findByAssignmentClassroomAndStudent (AssignmentClassroomEntity assignmentClassroom, UserEntity student, Pageable pageable);
    Page<SubmissionEntity> findByAssignmentClassroom_AssignmentEntity (AssignmentEntity assignment, Pageable pageable);
    void deleteByAssignmentClassroom_AssignmentEntity(AssignmentEntity assignment);
}

