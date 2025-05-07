package com.ogthmi.chekzam.module.classroom_student;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.Endpoint;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import com.ogthmi.chekzam.module.classroom_student.dto.ClassroomStudentRequest;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoint.Classroom.ROOT)
@AllArgsConstructor
@Slf4j
public class ClassroomStudentController {
    private final ClassroomStudentService classroomStudentService;

    @GetMapping(Endpoint.Classroom.GET_ALL_MEMBERS)
    public ApiResponse<Page<FullUserInfoResponse>> getAllStudentsInClassroom(
            @PathVariable String classroomId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(
                classroomStudentService.getAllStudentsInClassroom(classroomId, pageNumber, pageSize, sortBy, direction, keyword),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping(Endpoint.Classroom.MEMBER)
    public ApiResponse<Void> addStudentsIntoClassroom(
            @PathVariable String classroomId,
            @RequestBody ClassroomStudentRequest classroomStudentRequest) {
        classroomStudentService.addStudentToClassroom(classroomId, classroomStudentRequest);
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
        classroomStudentService.removeStudentFromClassroom(classroomId, studentId);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setMessage(String.format("Xóa sinh viên %s khỏi lớp %s thành công", studentId, classroomId));
        return response;
    }

    @PostMapping(Endpoint.Classroom.GET_ONE_MEMBER)
    public ApiResponse<Void> joinClassroom (@PathVariable String classroomId){
        classroomStudentService.joinClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.ASSIGNED_SUCCESSFULLY);
    }

    @DeleteMapping(Endpoint.Classroom.GET_ME)
    public ApiResponse<Void> leaveClassroom (@PathVariable String classroomId){
        classroomStudentService.leaveClassroom(classroomId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }
}
