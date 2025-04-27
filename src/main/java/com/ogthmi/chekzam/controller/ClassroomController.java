package com.ogthmi.chekzam.controller;

import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.classroom.ClassroomInfoRequest;
import com.ogthmi.chekzam.dto.classroom.ClassroomStudentRequest;
import com.ogthmi.chekzam.dto.api.ApiResponse;
import com.ogthmi.chekzam.dto.classroom.ClassroomInfoResponse;
import com.ogthmi.chekzam.dto.user.FullUserInfoResponse;
import com.ogthmi.chekzam.exception.message.SuccessMessageCode;
import com.ogthmi.chekzam.mapper.ClassroomMapper;
import com.ogthmi.chekzam.service.classroom.ClassroomService;
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

}
