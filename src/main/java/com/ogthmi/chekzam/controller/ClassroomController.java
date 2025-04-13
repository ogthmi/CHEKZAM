package com.ogthmi.chekzam.controller;

import com.ogthmi.chekzam.constant.Endpoint;
import com.ogthmi.chekzam.dto.request.ClassroomRequest;
import com.ogthmi.chekzam.dto.response.ApiResponse;
import com.ogthmi.chekzam.dto.response.ClassroomResponse;
import com.ogthmi.chekzam.dto.response.user.UserProfileResponse;
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

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ApiResponse<ClassroomResponse> createNewClassroom(@RequestBody ClassroomRequest classroomRequest) {
        return ApiResponse.ok(classroomService.createNewClassroom(classroomRequest));
    }

    @GetMapping(Endpoint.Classroom.GET_ALL)
    public ApiResponse<Page<ClassroomResponse>> getAllClassrooms(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "classroomName") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.ok(
                classroomService.getAllClassroom(pageNumber, pageSize, sortBy, direction, keyword)
        );
    }


    @GetMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<ClassroomResponse> getUserClassroom(@PathVariable String classroomId) {
        return ApiResponse.ok(classroomService.getClassroom(classroomId));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping(Endpoint.Classroom.GET_ALL_MEMBERS)
    public ApiResponse<Page<UserProfileResponse>> getAllStudentsInClassroom(
            @PathVariable String classroomId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.ok(classroomService.getAllStudentsInClassroom(classroomId, pageNumber, pageSize, sortBy, direction, keyword));
    }

    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping(Endpoint.Classroom.GET_ONE_MEMBER)
    public ApiResponse<ClassroomResponse> addStudentToClassroom(
            @PathVariable String classroomId,
            @PathVariable String studentId) {
        ClassroomResponse classroomResponse = classroomService.addStudentToClassroom(classroomId, studentId);
        return ApiResponse.ok(classroomResponse);
    }

    @PutMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<ClassroomResponse> updateClassroom(
            @PathVariable String classroomId,
            @RequestBody ClassroomRequest classroomRequest) {
        ClassroomResponse updatedClassroom = classroomService.updateClassroom(classroomId, classroomRequest);
        return ApiResponse.ok(updatedClassroom);
    }

    @DeleteMapping(Endpoint.Classroom.GET_ONE)
    public ApiResponse<String> deleteClassroom(@PathVariable String classroomId) {
        return ApiResponse.ok(classroomService.deleteClassroom(classroomId));
    }

}
