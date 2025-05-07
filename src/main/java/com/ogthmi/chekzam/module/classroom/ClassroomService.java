package com.ogthmi.chekzam.module.classroom;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.classroom_student.ClassroomStudentRepository;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoRequest;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.assignment.AssignmentMapper;
import com.ogthmi.chekzam.module.assignment.AssignmentRepository;
import com.ogthmi.chekzam.module.user.user_service.UserService;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@AllArgsConstructor
@Slf4j
public class ClassroomService {
    private final ClassroomRepository classroomRepository;
    private final ClassroomStudentRepository classroomStudentRepository;
    private final UserService userService;
    private final ClassroomMapper classroomMapper;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentMapper assignmentMapper;


    public ClassroomEntity findClassroomById(String classroomId) {
        return classroomRepository.findById(classroomId).orElseThrow(
                () -> new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_FOUND)
        );
    }

    private boolean hasAccessToClassroom(UserEntity userEntity, ClassroomEntity classroomEntity) {
        List<Role> roles = userEntity.getRoles();
        if (roles.contains(Role.ADMIN)){
            return true;
        }
        if (roles.contains(Role.TEACHER)){
            return classroomEntity.getTeacher().equals(userEntity);
        }
        if (roles.contains(Role.STUDENT)){
            ClassroomStudentEntity classroomStudentEntity = ClassroomStudentEntity.builder()
                    .classroomEntity(classroomEntity)
                    .userEntity(userEntity)
                    .build();
            return classroomStudentEntity != null;
        }
        return false;
    }

    public ClassroomEntity findClassroomByIdAndCurrentUserRole(String classroomId) {
        ClassroomEntity classroomEntity = findClassroomById(classroomId);
        UserEntity currentUserEntity = userService.findCurrentUser();

        if (!hasAccessToClassroom(currentUserEntity, classroomEntity)) {
            log.warn("Unauthorized access attempt by user {} to classroomEntity {}", currentUserEntity.getUserId(), classroomId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return classroomEntity;
    }

    public ClassroomInfoResponse createNewClassroom(ClassroomInfoRequest classroomInfoRequest) {
        UserEntity teacher = userService.findCurrentUser();

        ClassroomEntity newClassroomEntity = classroomMapper.toClassroom(classroomInfoRequest);
        newClassroomEntity.setTeacher(teacher);
        newClassroomEntity.setCreatedAt(LocalDateTime.now());

        classroomRepository.save(newClassroomEntity);
        return classroomMapper.toClassroomResponse(newClassroomEntity);
    }

    public Page<ClassroomInfoResponse> getAllClassroom(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentUserEntity = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);

        Page<ClassroomEntity> classroomsPage = getAllClassroomsByRole(currentUserEntity, keyword, pageable);
        return classroomsPage.map(classroomMapper::toClassroomResponse);
    }

    private Page<ClassroomEntity> getAllClassroomsByRole(UserEntity userEntity, String keyword, Pageable pageable) {
        List<Role> roles = userEntity.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return findAllClassroomsForAdmin(keyword, pageable);
        } else if (roles.contains(Role.TEACHER)) {
            return findAllClassroomsForTeacher(userEntity, keyword, pageable);
        } else if (roles.contains(Role.STUDENT)) {
            return findAllClassroomsForStudent(userEntity, keyword, pageable);
        } else {
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
    }

    private Page<ClassroomEntity> findAllClassroomsForAdmin(String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findAll(pageable)
                : classroomRepository.findByClassroomNameContainingIgnoreCase(keyword, pageable);
    }

    private Page<ClassroomEntity> findAllClassroomsForTeacher(UserEntity teacher, String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findByTeacher(teacher, pageable)
                : classroomRepository.findByTeacherAndClassroomNameContainingIgnoreCase(teacher, keyword, pageable);
    }

    private Page<ClassroomEntity> findAllClassroomsForStudent(UserEntity student, String keyword, Pageable pageable) {
        return classroomRepository.findByStudentAndClassroomNameContainingIgnoreCase(student, keyword, pageable);
    }

    public ClassroomInfoResponse updateClassroomInfo(String classroomId, ClassroomInfoRequest classroomInfoRequest) {
        ClassroomEntity classroomEntity = findClassroomByIdAndCurrentUserRole(classroomId);
        classroomEntity.setClassroomName(classroomInfoRequest.getClassroomName());
        classroomEntity.setDescription(classroomInfoRequest.getDescription());
        classroomRepository.save(classroomEntity);
        return classroomMapper.toClassroomResponse(classroomEntity);
    }

    public void deleteClassroom(String classroomId) {
        ClassroomEntity classroomEntity = findClassroomByIdAndCurrentUserRole(classroomId);
        classroomRepository.delete(classroomEntity);
        log.info("Xóa thành công lớp {}", classroomId);
    }

    public Page<AssignmentResponse> getAllAssignmentInClassroom(
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<AssignmentEntity> assignmentPage;

        if (keyword == null || keyword.isEmpty()) {
            assignmentPage = assignmentRepository.findByClassroomList_ClassroomEntity_ClassroomId(classroomId, pageable);
        } else {
            assignmentPage = assignmentRepository.findByClassroomList_ClassroomEntity_ClassroomIdAndAssignmentNameContainingIgnoreCase(
                    classroomId, keyword, pageable);
        }

        return assignmentPage.map(assignmentMapper::toAssignmentInfoResponse);
    }

}