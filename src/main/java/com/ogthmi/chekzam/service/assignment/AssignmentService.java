package com.ogthmi.chekzam.service.assignment;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.dto.assignment.AssignmentClassroomRequest;
import com.ogthmi.chekzam.dto.assignment.AssignmentRequest;
import com.ogthmi.chekzam.dto.assignment.AssignmentResponse;
import com.ogthmi.chekzam.dto.assignment.core.QuestionDTO;
import com.ogthmi.chekzam.entity.Classroom;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.entity.assignment.Assignment;
import com.ogthmi.chekzam.entity.assignment.AssignmentQuestion;
import com.ogthmi.chekzam.entity.assignment.Question;
import com.ogthmi.chekzam.exception.ApplicationException;
import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import com.ogthmi.chekzam.mapper.AssignmentMapper;
import com.ogthmi.chekzam.mapper.QuestionMapper;
import com.ogthmi.chekzam.repository.AssignmentQuestionRepository;
import com.ogthmi.chekzam.repository.AssignmentRepository;
import com.ogthmi.chekzam.repository.QuestionRepository;
import com.ogthmi.chekzam.service.classroom.ClassroomService;
import com.ogthmi.chekzam.service.user.UserService;
import com.ogthmi.chekzam.util.PaginationUtil;
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
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final UserService userService;
    private final AssignmentMapper assignmentMapper;
    private final ClassroomService classroomService;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final QuestionService questionService;
    private final QuestionMapper questionMapper;

    public Assignment findAssignmentById(String assignmentId) {
        return assignmentRepository.findById(assignmentId).orElseThrow(
                () -> new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NOT_FOUND)
        );
    }

    public AssignmentResponse createNewAssignment(AssignmentRequest assignmentRequest) {
        Assignment newAssignment = assignmentMapper.toAssignment(assignmentRequest);
        newAssignment.setTeacher(userService.findCurrentUser());
        newAssignment.setCreatedAt(LocalDateTime.now());

        assignmentRepository.save(newAssignment);

        if (assignmentRequest.getQuestionList() == null) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_EMPTY);
        }

        int order = 1;
        for (QuestionDTO questionRequest : assignmentRequest.getQuestionList()) {
            Question question = questionService.saveQuestionWithAnswer(questionRequest);
            AssignmentQuestion assignmentQuestion = AssignmentQuestion.builder()
                    .assignment(newAssignment)
                    .question(question)
                    .questionOrder(order++)
                    .build();
            assignmentQuestionRepository.save(assignmentQuestion);
        }
        return assignmentMapper.toAssignmentInfoResponse(newAssignment);
    }

    private boolean hasAccessToAssignment(User user, Assignment assignment) {
        List<Role> roles = user.getRoles();
        if (roles.contains(Role.ADMIN)) {
            return true;
        }
        if (roles.contains(Role.TEACHER)) {
            return assignment.getTeacher().getUserId().equals(user.getUserId());
        } else if (roles.contains(Role.STUDENT)) {
            return user.getClassrooms().stream()
                    .anyMatch(classroom -> classroom.getAssignmentList().contains(assignment));
        }
        return false;
    }

    public AssignmentResponse getAssignmentInfo(String assignmentId) {
        User currentUser = userService.findCurrentUser();
        Assignment assignment = findAssignmentById(assignmentId);
        if (!hasAccessToAssignment(currentUser, assignment)) {
            log.warn("Unauthorized access attempt by user {} to assignment {}", currentUser.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return assignmentMapper.toAssignmentInfoResponse(assignment);
    }

    public Page<QuestionDTO> getAssignmentContent(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        User currentUser = userService.findCurrentUser();
        Assignment assignment = findAssignmentById(assignmentId);
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        if (!hasAccessToAssignment(currentUser, assignment)) {
            log.warn("Unauthorized access attempt by user {} to assignment {}", currentUser.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        Page <AssignmentQuestion> questionPage;
        if (keyword == null || keyword.isBlank()){
            questionPage = assignmentQuestionRepository.findByAssignment(assignment, pageable);
        }
        else questionPage = assignmentQuestionRepository.findByAssignmentAndQuestion_QuestionContentContainingIgnoreCase(assignment, keyword, pageable);
        return questionPage.map(questionMapper::toQuestionDTO);
    }


    public AssignmentResponse updateAssignmentInfo(String assignmentId, AssignmentRequest assignmentRequest) {
        Assignment assignment = findAssignmentById(assignmentId);
        return assignmentMapper.toAssignmentInfoResponse(assignment);
    }

    public Page<AssignmentResponse> getAllAssignmentsByCurrentTeacher(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        User currentTeacher = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<Assignment> assignmentPage = assignmentRepository
                .findByTeacherAndAssignmentNameContainingIgnoreCase(currentTeacher, keyword, pageable);
        return assignmentPage.map(assignmentMapper::toAssignmentInfoResponse);
    }

    public void deleteAssignment(String assignmentId) {

    }

    public void attachAssignmentToClassrooms(String assignmentId, AssignmentClassroomRequest assignmentClassroomRequest) {
        Assignment assignment = findAssignmentById(assignmentId);
        for (String classroomId : assignmentClassroomRequest.getClassroomIdList()) {
            Classroom classroom = classroomService.findClassroomByIdAndCurrentUserRole(classroomId);
            assignment.getClassroomList().add(classroom);
        }
        assignmentRepository.save(assignment);
    }

    public void detachAssignmentFromClassroom(String assignemntId, String classroomId) {

    }
}
