package com.ogthmi.chekzam.module.assignment_classroom;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.assignment_classroom.dto.AssignmentClassroomRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Endpoint.Assignment.ROOT)
@AllArgsConstructor
@Slf4j
public class AssignmentClassroomController {
    private final AssignmentClassroomService assignmentClassroomService;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/attach")
    public ApiResponse<Void> attachAssignmentsIntoClassrooms (@RequestBody AssignmentClassroomRequest assignmentClassroomRequest){
        assignmentClassroomService.attachAssignmentToClassrooms(assignmentClassroomRequest);
        return ApiResponse.voidSuccess(SuccessMessageCode.ASSIGNED_SUCCESSFULLY);
    }

}
