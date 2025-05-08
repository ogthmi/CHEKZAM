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

    public Page<AttachedAssignmentDTO> getAllAssignmentInClassroom(
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        Sort sort = sortBy.equals("assignment.assignmentName")
                ? Sort.by(Sort.Direction.fromString(direction), "assignmentEntity.assignmentName")
                : Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<AssignmentClassroomEntity> assignmentPage;

        if (keyword == null || keyword.isEmpty()) {
            assignmentPage = assignmentClassroomRepository.findByClassroomEntity_ClassroomId(classroomId, pageable);
        } else {
            assignmentPage = assignmentClassroomRepository
                    .findByClassroomEntity_ClassroomIdAndAssignmentEntity_AssignmentNameContainingIgnoreCase(classroomId, keyword, pageable);
        }
        return assignmentPage.map(assignmentClassroomMapper::toAssignmentClassroomResponse);
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
        AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomRepository
                .findByAssignmentEntity_AssignmentIdAndClassroomEntity_ClassroomId(assignmentId, classroomId)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT));
        assignmentClassroomEntity.setDuration(attachedAssignmentDTO.getDuration());
        assignmentClassroomEntity.setMaxAttempts(attachedAssignmentDTO.getMaxAttempts());
        assignmentClassroomEntity.setOpenTime(attachedAssignmentDTO.getOpenTime());
        assignmentClassroomEntity.setDueTime(attachedAssignmentDTO.getDueTime());
        assignmentClassroomRepository.save(assignmentClassroomEntity);
    }
}
