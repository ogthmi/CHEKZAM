package com.ogthmi.chekzam.module.classroom_student;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomService;
import com.ogthmi.chekzam.module.classroom_student.dto.ClassroomStudentRequest;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.UserMapper;
import com.ogthmi.chekzam.module.user.UserRepository;
import com.ogthmi.chekzam.module.user.user_dto.FullUserInfoResponse;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.user_service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class ClassroomStudentService {
    private final ClassroomService classroomService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ClassroomStudentRepository classroomStudentRepository;


    private ClassroomStudentEntity toClassroomStudentEntity(ClassroomEntity classroomEntity, UserEntity userEntity) {
        return ClassroomStudentEntity.builder()
                .classroomEntity(classroomEntity)
                .userEntity(userEntity)
                .build();
    }

    public Page<FullUserInfoResponse> getAllStudentsInClassroom(
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<UserEntity> students;
        if (keyword == null || keyword.isEmpty()) {
            students = userRepository.findByClassroomList_ClassroomEntity_ClassroomIdAndRolesContaining(classroomId, Role.STUDENT, pageable);
        } else {
            students = userRepository.searchByFullNameInClassroom(classroomId, Role.STUDENT, keyword, pageable);
        }
        return students.map(userMapper::toFullUserInfoResponse);
    }

    public void addStudentToClassroom(String classroomId, ClassroomStudentRequest classroomStudentRequest) {
        ClassroomEntity currentClassroom = classroomService.findClassroomByIdAndCurrentUserRole(classroomId);

        for (String studentId : classroomStudentRequest.getStudentIdList()) {
            UserEntity student = userService.findUserById(studentId);

            boolean alreadyExists = classroomStudentRepository.existsByClassroomEntityAndUserEntity(currentClassroom, student);
            if (alreadyExists) continue;

            ClassroomStudentEntity classroomStudentEntity = toClassroomStudentEntity(currentClassroom, student);
            classroomStudentRepository.save(classroomStudentEntity);
        }

        log.info("Thêm {} sinh viên vào lớp học {} thành công",
                classroomStudentRequest.getStudentIdList().size(),
                currentClassroom.getClassroomId()
        );
    }

    public void removeStudentFromClassroom(String classroomId, String studentId) {
        ClassroomEntity currentClassroom = classroomService.findClassroomByIdAndCurrentUserRole(classroomId);
        UserEntity student = userService.findUserById(studentId);

        ClassroomStudentEntity classroomStudentEntity = classroomStudentRepository
                .findByClassroomEntityAndUserEntity(currentClassroom, student)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.STUDENT_NOT_IN_CLASS));

        classroomStudentRepository.delete(classroomStudentEntity);

        log.info("Xóa thành công sinh viên: {} khỏi lớp {}", studentId, classroomId);
    }


    public void joinClassroom(String classroomId) {
        UserEntity currentUser = userService.findCurrentUser();
        if (!currentUser.getRoles().contains(Role.STUDENT)) {
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }

        ClassroomEntity classroomEntity = classroomService.findClassroomById(classroomId);

        boolean alreadyJoined = classroomStudentRepository.existsByClassroomEntityAndUserEntity(classroomEntity, currentUser);
        if (alreadyJoined) return;

        ClassroomStudentEntity entity = toClassroomStudentEntity(classroomEntity, currentUser);
        classroomStudentRepository.save(entity);
    }

    public void leaveClassroom(String classroomId) {
        UserEntity currentUser = userService.findCurrentUser();
        ClassroomEntity classroomEntity = classroomService.findClassroomById(classroomId);

        ClassroomStudentEntity entity = classroomStudentRepository
                .findByClassroomEntityAndUserEntity(classroomEntity, currentUser)
                .orElseThrow(() -> new ApplicationException(ExceptionMessageCode.STUDENT_NOT_IN_CLASS));

        classroomStudentRepository.delete(entity);
    }

}
