package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoRequest;
import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.assignment.AssignmentService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoint.Classroom.ROOT)
@AllArgsConstructor
@Slf4j
public class ClassroomController {
    private final ClassroomService classroomService;
    private final AssignmentService assignmentService;
    private final ClassroomMapper classroomMapper;

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ApiResponse<ClassroomInfoResponse> createNewClassroom(@RequestBody ClassroomInfoRequest classroomInfoRequest) {
        return ApiResponse.success(
                classroomService.createNewClassroom(classroomInfoRequest),
                SuccessMessageCode.CREATED_SUCCESSFULLY
        );
    }

    @GetMapping(Endpoint.Classroom.GET_ALL)
    public ApiResponse<Page<ClassroomInfoResponse>> getAllClassrooms(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "classroomName") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                classroomService.getAllClassroom(pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @GetMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<ClassroomInfoResponse> getClassroom(@PathVariable String classroomId) {
        return ApiResponse.success(
                classroomMapper.toClassroomResponse(
                        classroomService.findClassroomByIdAndCurrentUserRole(classroomId)
                ),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PutMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<ClassroomInfoResponse> updateClassroom(
            @PathVariable String classroomId,
            @RequestBody ClassroomInfoRequest classroomInfoRequest) {
        ClassroomInfoResponse updatedClassroom = classroomService.updateClassroomInfo(classroomId, classroomInfoRequest);
        return ApiResponse.success(updatedClassroom, SuccessMessageCode.UPDATED_SUCCESSFULLY);
    }

    @DeleteMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<Void> deleteClassroom(@PathVariable String classroomId) {
        classroomService.deleteClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }


//    @PreAuthorize("hasRole('TEACHER')")
//    @DeleteMapping(Endpoint.Classroom.GET_ONE_ASSIGNMENT)
//    public ApiResponse<Void> detachAssignmentFromCLassroom(
//            @PathVariable String classroomId,
//            @PathVariable String assignmentId
//    ){
//        assignmentService.detachAssignmentFromClassroom(classroomId, assignmentId);
//        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
//    };
}
