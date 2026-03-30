package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AssignmentClassroomRequestList;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AttachedAssignmentDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@Slf4j
public class AssignmentClassroomController {
    private final AssignmentClassroomService assignmentClassroomService;

    @GetMapping("/classroom/{classroomId}/assignment/all")
    public ApiResponse<Page<AttachedAssignmentDTO>> getAllAssignmentInClassroom(
            @PathVariable String classroomId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "assignedTime") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                assignmentClassroomService.getAllAssignmentInClassroom(classroomId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @GetMapping("/assignment/{assignmentId}/classroom/all")
    public ApiResponse<Page<AttachedAssignmentDTO>> getAllClassroomsForAssignment(
            @PathVariable String assignmentId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "assignedTime") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                assignmentClassroomService.getAllClassroomsForAssignment(assignmentId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @GetMapping("/assignment/{assignmentId}/classroom/{classroomId}")
    public ApiResponse<AttachedAssignmentDTO> getAssignmentClassroomLinkInfo(@PathVariable String assignmentId, @PathVariable String classroomId) {
        return ApiResponse.success(
                assignmentClassroomService.getAssignmentClassroomLinkInfo(assignmentId, classroomId),
                SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }


    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/assignment/attach")
    public ApiResponse<Void> attachAssignmentsIntoClassrooms(@RequestBody AssignmentClassroomRequestList assignmentClassroomRequestList) {
        assignmentClassroomService.attachAssignmentToClassrooms(assignmentClassroomRequestList);
        return ApiResponse.voidSuccess(SuccessMessageCode.ASSIGNED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/classroom/{classroomId}/assignment/{assignmentId}")
    public ApiResponse<Void> detachAssignmentFromClassroom(@PathVariable String classroomId, @PathVariable String assignmentId) {
        assignmentClassroomService.detachAssignmentFromClassroom(classroomId, assignmentId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/assignment/{assignmentId}")
    public ApiResponse<Void> updateAssignmentInfoAndAssignmentClassroomLinkInfo(@PathVariable String assignmentId, @RequestBody AttachedAssignmentDTO attachedAssignmentDTO) {
        assignmentClassroomService.updateAssignmentInfo(assignmentId, attachedAssignmentDTO);
        return ApiResponse.voidSuccess(SuccessMessageCode.UPDATED_SUCCESSFULLY);
    }
}
