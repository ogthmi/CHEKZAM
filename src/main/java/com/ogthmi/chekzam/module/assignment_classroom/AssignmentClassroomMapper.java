package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment.AssignmentMapper;
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
                .maxAttempts(record.getMaxAttempts())
                .duration(record.getDuration())
                .isShuffleEnable(record.isShuffleEnabled())
                .openTime(record.getOpenTime())
                .dueTime(record.getDueTime())
                .build();
    }

    public AttachedAssignmentDTO toAssignmentClassroomResponse(
            AssignmentClassroomEntity entity, String needField) {

        AttachedAssignmentDTO.AttachedAssignmentDTOBuilder builder = AttachedAssignmentDTO.builder()
                .duration(entity.getDuration())
                .maxAttempts(entity.getMaxAttempts())
                .isShuffleEnabled(entity.isShuffleEnable())
                .assignedTime(entity.getAssignedTime())
                .openTime(entity.getOpenTime())
                .dueTime(entity.getDueTime());

        if ("assignment".equalsIgnoreCase(needField)) {
            fillAssignmentFields(builder, entity.getAssignmentEntity());
        }

        if ("classroom".equalsIgnoreCase(needField)) {
            fillClassroomFields(builder, entity.getClassroomEntity());
        }

        return builder.build();
    }

    private void fillAssignmentFields(AttachedAssignmentDTO.AttachedAssignmentDTOBuilder builder,
                                      AssignmentEntity assignment) {
        builder.assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .description(assignment.getDescription())
                .assignmentType(assignment.getAssignmentType());

        if (assignment.getQuestionList() != null) {
            builder.totalQuestions(assignment.getQuestionList().size());
        }
    }

    private void fillClassroomFields(AttachedAssignmentDTO.AttachedAssignmentDTOBuilder builder,
                                     ClassroomEntity classroom) {
        builder.classroomId(classroom.getClassroomId())
                .classroomName(classroom.getClassroomName());
    }

}
