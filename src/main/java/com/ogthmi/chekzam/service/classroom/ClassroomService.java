package com.ogthmi.chekzam.service.classroom;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.classroom.ClassroomInfoRequest;
import com.ogthmi.chekzam.dto.classroom.ClassroomStudentRequest;
import com.ogthmi.chekzam.dto.classroom.ClassroomInfoResponse;
import com.ogthmi.chekzam.dto.user.FullUserInfoResponse;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.ClassroomMapper;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.ClassroomRepository;
import com.ogthmi.chekzam.repository.UserRepository;
import com.ogthmi.chekzam.util.PaginationUtil;
import com.ogthmi.chekzam.service.user.UserService;
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
    private final UserService userService;
    private final UserRepository userRepository;
    private final ClassroomMapper classroomMapper;
    private final UserMapper userMapper;


    private Classroom findClassroomById(String classroomId){
        return classroomRepository.findById(classroomId).orElseThrow(
                () -> new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_FOUND)
        );
    }

    private boolean hasAccessToClassroom(User user, Classroom classroom) {
        List<Role> roles = user.getRoles();
        return  roles.contains(Role.ADMIN) ||
                (roles.contains(Role.TEACHER) && classroom.getTeacher().equals(user)) ||
                classroom.getStudents().contains(user);
    }

    public Classroom findClassroomByIdAndCurrentUserRole(String classroomId) {
        Classroom classroom = findClassroomById(classroomId);
        User currentUser = userService.findCurrentUser();

        if (!hasAccessToClassroom(currentUser, classroom)){
            log.warn("Unauthorized access attempt by user {} to classroom {}", currentUser.getUserId(), classroomId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return classroom;
    }

    public ClassroomInfoResponse createNewClassroom (ClassroomInfoRequest classroomInfoRequest){
        User teacher =  userService.findCurrentUser();

        Classroom newClassroom = classroomMapper.toClassroom(classroomInfoRequest);
        newClassroom.setTeacher(teacher);
        newClassroom.setCreatedAt(LocalDateTime.now());

        classroomRepository.save(newClassroom);
        return classroomMapper.toClassroomResponse(newClassroom);
    }

    public Page<ClassroomInfoResponse> getAllClassroom(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        User currentUser = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);

        Page<Classroom> classroomsPage = getAllClassroomsByRole(currentUser, keyword, pageable);
        return classroomsPage.map(classroomMapper::toClassroomResponse);
    }

    private Page<Classroom> getAllClassroomsByRole(User user, String keyword, Pageable pageable) {
        List<Role> roles = user.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return findAllClassroomsForAdmin(keyword, pageable);
        } else if (roles.contains(Role.TEACHER)) {
            return findAllClassroomsForTeacher(user, keyword, pageable);
        } else if (roles.contains(Role.STUDENT)) {
            return findAllClassroomsForStudent(user, keyword, pageable);
        } else {
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
    }

    private Page<Classroom> findAllClassroomsForAdmin(String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findAll(pageable)
                : classroomRepository.findByClassroomNameContainingIgnoreCase(keyword, pageable);
    }

    private Page<Classroom> findAllClassroomsForTeacher(User teacher, String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findByTeacher(teacher, pageable)
                : classroomRepository.findByTeacherAndClassroomNameContainingIgnoreCase(teacher, keyword, pageable);
    }

    private Page<Classroom> findAllClassroomsForStudent(User student, String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findByStudentsContaining(student, pageable)
                : classroomRepository.findByStudentsContainingAndClassroomNameContainingIgnoreCase(student, keyword, pageable);
    }

    public Page<FullUserInfoResponse> getAllStudentsInClassroom (
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ){
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<User> students = userRepository.findByClassrooms_ClassroomIdAndRolesContaining(classroomId, Role.STUDENT, pageable);
        return students.map(userMapper::toFullUserInfoResponse);
    }

    public void addStudentToClassroom(String classroomId, ClassroomStudentRequest classroomStudentRequest) {
        Classroom classroom = findClassroomByIdAndCurrentUserRole(classroomId);
        for (String studentId: classroomStudentRequest.getStudentIdList()){
            User student = userService.findUserById(studentId);
            classroom.getStudents().add(student);
        }
        classroomRepository.save(classroom);
        log.info("Thêm {} sinh viên vào lớp học {} thành công",
                classroomStudentRequest.getStudentIdList().size(),
                classroom.getClassroomId()
        );
    }

    public void removeStudentFromClassroom(String classroomId, String studentId) {
        Classroom classroom = findClassroomByIdAndCurrentUserRole(classroomId);

        User student = userService.findUserById(studentId);

        if (!classroom.getStudents().contains(student)) {
            throw new ApplicationException(ExceptionMessageCode.STUDENT_NOT_IN_CLASS);
        }

        classroom.getStudents().remove(student);
        classroomRepository.save(classroom);
        student.getClassrooms().remove(classroom);
        userRepository.save(student);

        log.info(String.format("Xóa thành công sinh viên: %s khỏi lớp %s", studentId, classroomId));
    }

    public ClassroomInfoResponse updateClassroom(String classroomId, ClassroomInfoRequest classroomInfoRequest) {
        Classroom classroom = findClassroomByIdAndCurrentUserRole(classroomId);
        classroom.setClassroomName(classroomInfoRequest.getClassroomName());
        classroom.setDescription(classroomInfoRequest.getDescription());
        classroomRepository.save(classroom);
        return classroomMapper.toClassroomResponse(classroom);
    }

    public void deleteClassroom(String classroomId) {
        Classroom classroom = findClassroomByIdAndCurrentUserRole(classroomId);
        classroomRepository.delete(classroom);
       log.info("Xóa thành công lớp {}", classroomId);
    }


}