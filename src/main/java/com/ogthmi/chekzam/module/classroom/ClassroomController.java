package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoRequest;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomStudentRequest;
import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
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
    public ApiResponse<ClassroomInfoResponse> getUserClassroom(@PathVariable String classroomId) {
        return ApiResponse.success(
                classroomMapper.toClassroomResponse(
                        classroomService.findClassroomByIdAndCurrentUserRole(classroomId)
                ),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }
    
    @GetMapping(Endpoint.Classroom.GET_ALL_MEMBERS)
    public ApiResponse<Page<FullUserInfoResponse>> getAllStudentsInClassroom(
            @PathVariable String classroomId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                classroomService.getAllStudentsInClassroom(classroomId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping(Endpoint.Classroom.MEMBER)
    public ApiResponse<Void> addStudentsIntoClassroom(
            @PathVariable String classroomId,
            @RequestBody ClassroomStudentRequest classroomStudentRequest) {
        classroomService.addStudentToClassroom(classroomId, classroomStudentRequest);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setMessage(String.format(
                "Thêm %d sinh viên vào lớp học %s thành công",
                classroomStudentRequest.getStudentIdList().size(),
                classroomId
        ));
        return response;
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping(Endpoint.Classroom.GET_ONE_MEMBER)
    public ApiResponse<Void> removeStudentFromClassroom(
            @PathVariable String classroomId,
            @PathVariable String studentId) {
        classroomService.removeStudentFromClassroom(classroomId, studentId);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setMessage(String.format("Xóa sinh viên %s khỏi lớp %s thành công", studentId, classroomId));
        return response;
    }

    @PostMapping(Endpoint.Classroom.GET_ONE_MEMBER)
    public ApiResponse<Void> joinClassroom (@PathVariable String classroomId){
        classroomService.joinClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.ASSIGNED_SUCCESSFULLY);
    }

    @DeleteMapping(Endpoint.Classroom.GET_ME)
    public ApiResponse<Void> leaveClassroom (@PathVariable String classroomId){
        classroomService.leaveClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }


    @PutMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<ClassroomInfoResponse> updateClassroom(
            @PathVariable String classroomId,
            @RequestBody ClassroomInfoRequest classroomInfoRequest) {
        ClassroomInfoResponse updatedClassroom = classroomService.updateClassroom(classroomId, classroomInfoRequest);
        return ApiResponse.success(updatedClassroom, SuccessMessageCode.UPDATED_SUCCESSFULLY);
    }

    @DeleteMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<Void> deleteClassroom(@PathVariable String classroomId) {
        classroomService.deleteClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }

    @GetMapping(Endpoint.Classroom.GET_ALL_ASSIGNMENTS)
    public ApiResponse<Page<AssignmentResponse>> getAllAssignmentInClassroom(
            @PathVariable String classroomId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                classroomService.getAllAssignmentInClassroom(classroomId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping(Endpoint.Classroom.GET_ONE_ASSIGNMENT)
    public ApiResponse<Void> detachAssignmentFromCLassroom(
            @PathVariable String classroomId,
            @PathVariable String assignmentId
    ){
        assignmentService.detachAssignmentFromClassroom(classroomId, assignmentId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    };
}
