package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment.AssignmentService;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AssignmentClassroomRequestList;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AttachedAssignmentDTO;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AssignmentClassroomService {
    private final AssignmentService assignmentService;
    private final ClassroomService classroomService;
    private final AssignmentClassroomRepository assignmentClassroomRepository;
    private final AssignmentClassroomMapper assignmentClassroomMapper;


    public AssignmentClassroomEntity findAssignmentClassroomEntity(String assignmentId, String classroomId) {
        return assignmentClassroomRepository.findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomId(assignmentId, classroomId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT));
    }

    public Page<AttachedAssignmentDTO> getAllAssignmentInClassroom(
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        Sort sort = sortBy.equals("assignmentName")
                ? Sort.by(Sort.Direction.fromString(direction), "assignmentEntity.assignmentName")
                : Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<AssignmentClassroomEntity> assignmentClassroomEntityPage;

        if (keyword == null || keyword.isEmpty()) {
            assignmentClassroomEntityPage = assignmentClassroomRepository.findByClassroomEntity_ClassroomId(classroomId, pageable);
        } else {
            assignmentClassroomEntityPage = assignmentClassroomRepository
                    .findByClassroomEntity_ClassroomIdAndAssignmentEntity_AssignmentNameContainingIgnoreCase(classroomId, keyword, pageable);
        }
        return assignmentClassroomEntityPage.map(assignmentClassroomEntity -> {
                    return assignmentClassroomMapper
                            .toAssignmentClassroomResponse(assignmentClassroomEntity, "assignment");
                }
        );
    }

    public Page<AttachedAssignmentDTO> getAllClassroomsForAssignment(
            String assignmentId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        Sort sort = sortBy.equals("classroomName")
                ? Sort.by(Sort.Direction.fromString(direction), "classroomEntity.classroomName")
                : sortBy.equals("classroomId")
                ? Sort.by(Sort.Direction.fromString(direction), "classroomEntity.classroomId")
                : Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<AssignmentClassroomEntity> assignmentClassroomEntityPage;

        if (keyword == null || keyword.isEmpty()) {
            assignmentClassroomEntityPage = assignmentClassroomRepository.findByAssignmentEntity_AssignmentId(assignmentId, pageable);
        } else {
            assignmentClassroomEntityPage = assignmentClassroomRepository
                    .findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomNameContainingIgnoreCase(assignmentId, keyword, pageable);
        }
        return assignmentClassroomEntityPage.map(assignmentClassroomEntity -> {
                    return assignmentClassroomMapper
                            .toAssignmentClassroomResponse(assignmentClassroomEntity, "classroom");
                }
        );
    }

    public AttachedAssignmentDTO getAssignmentClassroomLinkInfo(String assignmentId, String classroomId) {
        AssignmentClassroomEntity assignmentClassroomEntity = findAssignmentClassroomEntity(assignmentId, classroomId);
        return assignmentClassroomMapper.toAssignmentClassroomResponse(assignmentClassroomEntity, "assignment");
    }

    public void attachAssignmentToClassrooms(AssignmentClassroomRequestList assignmentClassroomRequestList) {
        for (AssignmentClassroomRequestList.AssignmentClassroomRequest record : assignmentClassroomRequestList.getAssignmentClassroomRequestList()) {
            AssignmentEntity currentAssignment = assignmentService.findAssignmentByIdAndCurrentUserRole(record.getAssignmentId());
            ClassroomEntity currentClassroom = classroomService.findClassroomByIdAndCurrentUserRole(record.getClassroomId());
            boolean isAssignmentAttached = assignmentClassroomRepository.existsByAssignmentEntityAndClassroomEntity(currentAssignment, currentClassroom);
            if (isAssignmentAttached) continue;
            AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomMapper.toAssignmentClassroomEntity(currentAssignment, currentClassroom, record);
            assignmentClassroomRepository.save(assignmentClassroomEntity);
        }
    }

    public void detachAssignmentFromClassroom(String classroomId, String assignmentId) {
        AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomRepository
                .findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomId(assignmentId, classroomId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT));
        assignmentClassroomRepository.delete(assignmentClassroomEntity);
    }

    public void updateAttachedAssignmentInfoInClassroom(String classroomId, String assignmentId, AttachedAssignmentDTO attachedAssignmentDTO) {
        AssignmentClassroomEntity assignmentClassroomEntity = findAssignmentClassroomEntity(assignmentId, classroomId);
        assignmentClassroomEntity.setDuration(attachedAssignmentDTO.getDuration());
        assignmentClassroomEntity.setMaxAttempts(attachedAssignmentDTO.getMaxAttempts());
        assignmentClassroomEntity.setShuffleEnable(attachedAssignmentDTO.isShuffleEnabled());
        assignmentClassroomEntity.setOpenTime(attachedAssignmentDTO.getOpenTime());
        assignmentClassroomEntity.setDueTime(attachedAssignmentDTO.getDueTime());
        assignmentClassroomRepository.save(assignmentClassroomEntity);
    }
}
