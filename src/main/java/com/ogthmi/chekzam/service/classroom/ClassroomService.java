package com.ogthmi.chekzam.service.classroom;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.request.ClassroomRequest;
import com.ogthmi.chekzam.dto.response.ClassroomResponse;
import com.ogthmi.chekzam.dto.response.user.UserProfileResponse;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.MessageCode;
import com.ogthmi.chekzam.mapper.ClassroomMapper;
import com.ogthmi.chekzam.mapper.UserMapper;
import com.ogthmi.chekzam.repository.ClassroomRepository;
import com.ogthmi.chekzam.repository.UserRepository;
import com.ogthmi.chekzam.util.PaginationUtil;
import com.ogthmi.chekzam.service.user.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Set;


@Service
@AllArgsConstructor
public class ClassroomService {
    private final ClassroomRepository classroomRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ClassroomMapper classroomMapper;
    private final UserMapper userMapper;


    private Classroom findClassroomById(String classroomId){
        return classroomRepository.findById(classroomId).orElseThrow(
                () -> new ApplicationException(MessageCode.CLASSROOM_NOT_FOUND)
        );
    }

    public ClassroomResponse createNewClassroom (ClassroomRequest classroomRequest){
        User teacher =  userService.findCurrentUser();

        Classroom newClassroom = classroomMapper.toClassroom(classroomRequest);
        newClassroom.setTeacher(teacher);
        newClassroom.setCreatedAt(LocalDateTime.now());

        classroomRepository.save(newClassroom);
        return classroomMapper.toClassroomResponse(newClassroom);
    }

    public Page<ClassroomResponse> getAllClassroom(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        User currentUser = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);

        Page<Classroom> classroomsPage = getClassroomsByRole(currentUser, keyword, pageable);
        return classroomsPage.map(classroomMapper::toClassroomResponse);
    }

    private Page<Classroom> getClassroomsByRole(User user, String keyword, Pageable pageable) {
        List<Role> roles = user.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return findForAdmin(keyword, pageable);
        } else if (roles.contains(Role.TEACHER)) {
            return findForTeacher(user, keyword, pageable);
        } else if (roles.contains(Role.STUDENT)) {
            return findForStudent(user, keyword, pageable);
        } else {
            throw new ApplicationException(MessageCode.UNAUTHORIZED_ACCESS);
        }
    }

    private Page<Classroom> findForAdmin(String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findAll(pageable)
                : classroomRepository.findByClassroomNameContainingIgnoreCase(keyword, pageable);
    }

    private Page<Classroom> findForTeacher(User teacher, String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findByTeacher(teacher, pageable)
                : classroomRepository.findByTeacherAndClassroomNameContainingIgnoreCase(teacher, keyword, pageable);
    }

    private Page<Classroom> findForStudent(User student, String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? classroomRepository.findByStudentsContaining(student, pageable)
                : classroomRepository.findByStudentsContainingAndClassroomNameContainingIgnoreCase(student, keyword, pageable);
    }

    public ClassroomResponse getClassroom(String classroomId) {
        Classroom classroom = findClassroomById(classroomId);
        User currentUser = userService.findCurrentUser();

        List<Role> roles = currentUser.getRoles();
        if (roles.contains(Role.ADMIN) ||
                (roles.contains(Role.TEACHER) && classroom.getTeacher().equals(currentUser)) ||
                classroom.getStudents().contains(currentUser)) {
            return classroomMapper.toClassroomResponse(classroom);
        }
        throw new ApplicationException(MessageCode.UNAUTHORIZED_ACCESS);
    }

    public Page<UserProfileResponse> getAllStudentsInClassroom (
            String classroomId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ){
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<User> students = userRepository.findByClassrooms_ClassroomIdAndRolesContaining(classroomId, Role.STUDENT, pageable);
        return students.map(userMapper::toUserProfileResponse);
    }

    public ClassroomResponse addStudentToClassroom(String classroomId, String studentId) {
        User teacher = userService.findCurrentUser();
        Classroom classroom = findClassroomById(classroomId);

        if (!classroom.getTeacher().equals(teacher)) {
            throw new ApplicationException(MessageCode.UNAUTHORIZED_ACCESS);
        }

        User student = userRepository.findById(studentId).orElseThrow(
                () -> new ApplicationException(MessageCode.USER_NOT_FOUND)
        );

        classroom.getStudents().add(student);
        classroomRepository.save(classroom);

        return classroomMapper.toClassroomResponse(classroom);
    }

    public ClassroomResponse updateClassroom(String classroomId, ClassroomRequest classroomRequest) {
        User teacher = userService.findCurrentUser();
        Classroom classroom = findClassroomById(classroomId);

        if (!classroom.getTeacher().equals(teacher)) {
            throw new ApplicationException(MessageCode.UNAUTHORIZED_ACCESS);
        }

        classroom.setClassroomName(classroomRequest.getClassroomName());
        classroom.setDescription(classroomRequest.getDescription());

        classroomRepository.save(classroom);

        return classroomMapper.toClassroomResponse(classroom);
    }

    public String deleteClassroom(String classroomId) {
        User currentUser = userService.findCurrentUser();
        Classroom classroom = findClassroomById(classroomId);

        if (!(classroom.getTeacher().equals(currentUser) || currentUser.getRoles().contains(Role.ADMIN))) {
            throw new ApplicationException(MessageCode.UNAUTHORIZED_ACCESS);
        }

        classroomRepository.delete(classroom);
        return String.join(" ", "Xóa thành công lớp:", classroomId, classroom.getClassroomName());
    }


}