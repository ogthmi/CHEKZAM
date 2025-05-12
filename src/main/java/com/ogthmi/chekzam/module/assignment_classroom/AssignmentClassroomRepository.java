package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomId;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentClassroomRepository extends JpaRepository<AssignmentClassroomEntity, AssignmentClassroomId> {

    @Query("SELECT ace FROM AssignmentClassroomEntity ace " +
            "JOIN ace.assignmentEntity a " +
            "WHERE ace.classroomEntity = :classroom " +
            "ORDER BY LOWER(a.assignmentName) ASC")
    Page<AssignmentClassroomEntity> findAllSortedByAssignmentName(
            @Param("classroom") ClassroomEntity classroom,
            Pageable pageable
    );

    Page<AssignmentClassroomEntity> findByClassroomEntity_ClassroomId(String classroomId, Pageable pageable);


    Page<AssignmentClassroomEntity> findByClassroomEntity_ClassroomIdAndAssignmentEntity_AssignmentNameContainingIgnoreCase(String classroomId, String keyword, Pageable pageable);

    Page<AssignmentClassroomEntity> findByAssignmentEntity_AssignmentId(String assignmentId, Pageable pageable);

    Page<AssignmentClassroomEntity> findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomNameContainingIgnoreCase(String assignmentId, String keyword, Pageable pageable);

    boolean existsByAssignmentEntityAndClassroomEntity(AssignmentEntity assignmentEntity, ClassroomEntity classroomEntity);

    Optional<AssignmentClassroomEntity> findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomId(String assignmentId, String classroomId);
    List<AssignmentClassroomEntity> findByClassroomEntity(ClassroomEntity classroomEntity);
}
