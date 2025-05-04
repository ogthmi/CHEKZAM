package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoint.Assignment.ROOT)
@AllArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ApiResponse<AssignmentResponse> createNewAssignent(@RequestBody AssignmentRequest assignmentRequest) {
        return ApiResponse.success(assignmentService.createNewAssignment(assignmentRequest), SuccessMessageCode.CREATED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping(Endpoint.Assignment.GET_ALL)
    public ApiResponse<Page<AssignmentResponse>> getAllAssignmentInfoByCurentTeacher(@RequestParam(defaultValue = "0") int pageNumber, @RequestParam(defaultValue = "5") int pageSize, @RequestParam(defaultValue = "createdAt") String sortBy, @RequestParam(defaultValue = "desc") String direction, @RequestParam(required = false) String keyword) {
        return ApiResponse.success(assignmentService.getAllAssignmentsByCurrentTeacher(pageNumber, pageSize, sortBy, direction, keyword), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @GetMapping(Endpoint.Assignment.GET_ONE)
    public ApiResponse<AssignmentResponse> getAssignmentInfo(@PathVariable String assignmentId){
        return ApiResponse.success(assignmentService.getAssignmentInfo(assignmentId), SuccessMessageCode.FETCHED_SUCCESSFULLY);
    }

    @GetMapping(Endpoint.Assignment.QUESTION)
    public ApiResponse<Page<QuestionDTO>> getAssignmentQuestions(
            @PathVariable String assignmentId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ){
        return ApiResponse.success(
                assignmentService.getAssignmentContent(assignmentId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping(Endpoint.Assignment.ASSIGNED_CLASSROOM)
    public ApiResponse<Void> assignAssignmentToClassroom(@PathVariable String assignmentId, @RequestBody AssignmentClassroomRequest assignmentClassroomRequest) {
        assignmentService.attachAssignmentToClassrooms(assignmentId, assignmentClassroomRequest);
        return ApiResponse.voidSuccess(SuccessMessageCode.ASSIGNED_SUCCESSFULLY);
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping(Endpoint.Assignment.GET_ONE)
    public ApiResponse<Void> deleteAssignment (@PathVariable String assignmentId){
        assignmentService.deleteAssignment(assignmentId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }

}
