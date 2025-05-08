package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment.AssignmentMapper;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AssignmentClassroomRequestList;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AttachedAssignmentDTO;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AssignmentClassroomMapper {
    private final AssignmentMapper assignmentMapper;
    private final ClassroomMapper classroomMapper;

    public AssignmentClassroomEntity toAssignmentClassroomEntity(
            AssignmentEntity assignmentEntity,
            ClassroomEntity classroomEntity,
            AssignmentClassroomRequestList.AssignmentClassroomRequest record
    ) {
        return AssignmentClassroomEntity.builder()
                .classroomEntity(classroomEntity)
                .assignmentEntity(assignmentEntity)
                .openTime(record.getOpenTime())
                .dueTime(record.getDueTime())
                .duration(record.getDuration())
                .maxAttempts(record.getMaxAttempts())
                .build();
    }

    public AttachedAssignmentDTO toAssignmentClassroomResponse(
            AssignmentClassroomEntity assignmentClassroomEntity ) {
        AssignmentResponse assignmentResponse = assignmentMapper.toAssignmentInfoResponse(assignmentClassroomEntity.getAssignmentEntity());
        return AttachedAssignmentDTO.builder()
                .assignment(assignmentResponse)
                .duration(assignmentClassroomEntity.getDuration())
                .maxAttempts(assignmentClassroomEntity.getMaxAttempts())
                .assignedTime(assignmentClassroomEntity.getAssignedTime())
                .openTime(assignmentClassroomEntity.getOpenTime())
                .dueTime(assignmentClassroomEntity.getDueTime())
                .build();
    }
}
