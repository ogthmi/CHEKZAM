package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentStatus;
import com.ogthmi.chekzam.module.question.QuestionService;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.classroom.ClassroomEntity;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.question.Question;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.question.QuestionMapper;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomRepository;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionRepository;
import com.ogthmi.chekzam.module.classroom.ClassroomService;
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
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final AssignmentClassroomRepository assignmentClassroomRepository;
    private final UserService userService;
    private final ClassroomService classroomService;
    private final QuestionService questionService;
    private final AssignmentMapper assignmentMapper;
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
            AssignmentQuestionEntity assignmentQuestionEntity = AssignmentQuestionEntity.builder()
                    .assignment(newAssignment)
                    .question(question)
                    .questionOrder(order++)
                    .build();
            assignmentQuestionRepository.save(assignmentQuestionEntity);
        }
        return assignmentMapper.toAssignmentInfoResponse(newAssignment);
    }

    private boolean hasAccessToAssignment(UserEntity userEntity, Assignment assignment) {
        List<Role> roles = userEntity.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return true;
        }

        if (roles.contains(Role.TEACHER)) {
            String currentUserId = userEntity.getUserId();
            String assignmentOwnerId = assignment.getTeacher().getUserId();
            return currentUserId.equals(assignmentOwnerId);
        }

        if (roles.contains(Role.STUDENT)) {
            for (ClassroomEntity classroomEntity : userEntity.getClassroomEntities()) {
                for (AssignmentClassroomEntity ac : classroomEntity.getAssignmentList()) {
                    if (ac.getAssignment().getAssignmentId().equals(assignment.getAssignmentId())) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public AssignmentResponse getAssignmentInfo(String assignmentId) {
        UserEntity currentUserEntity = userService.findCurrentUser();
        Assignment assignment = findAssignmentById(assignmentId);
        if (!hasAccessToAssignment(currentUserEntity, assignment)) {
            log.warn("Unauthorized access attempt by user {} to assignment {}", currentUserEntity.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return assignmentMapper.toAssignmentInfoResponse(assignment);
    }

    public Page<QuestionDTO> getAssignmentContent(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentUserEntity = userService.findCurrentUser();
        Assignment assignment = findAssignmentById(assignmentId);
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        if (!hasAccessToAssignment(currentUserEntity, assignment)) {
            log.warn("Unauthorized access attempt by user {} to assignment {}", currentUserEntity.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        Page<AssignmentQuestionEntity> questionPage;
        if (keyword == null || keyword.isBlank()) {
            questionPage = assignmentQuestionRepository.findByAssignment(assignment, pageable);
        } else
            questionPage = assignmentQuestionRepository.findByAssignmentAndQuestion_QuestionContentContainingIgnoreCase(assignment, keyword, pageable);
        return questionPage.map(questionMapper::toQuestionDTO);
    }

    public AssignmentResponse updateAssignmentInfo(String assignmentId, AssignmentRequest assignmentRequest) {
        Assignment assignment = findAssignmentById(assignmentId);
        assignment.setAssignmentName(assignmentRequest.getAssignmentName());
        assignment.setDescription(assignmentRequest.getDescription());
        assignment.setStartTime(assignment.getStartTime());
        assignment.setEndTime(assignment.getEndTime());
        assignmentRepository.save(assignment);
        return assignmentMapper.toAssignmentInfoResponse(assignment);
    }

    public Page<AssignmentResponse> getAllAssignmentsByCurrentTeacher(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentTeacher = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<Assignment> assignmentPage = assignmentRepository
                .findByTeacherAndAssignmentNameContainingIgnoreCase(currentTeacher, keyword, pageable);
        return assignmentPage.map(assignmentMapper::toAssignmentInfoResponse);
    }

    public void deleteAssignment(String assignmentId) {
        Assignment assignment = findAssignmentById(assignmentId);

        List<Question> questionsToCheck = assignment.getQuestionList().stream()
                .map(AssignmentQuestionEntity::getQuestion)
                .distinct()
                .toList();

        assignmentRepository.delete(assignment);

        for (Question question : questionsToCheck) {
            long count = assignmentQuestionRepository.countByQuestion(question);
            if (count == 0) {
                questionService.deleteQuestion(question);
            }
        }
    }

    public void attachAssignmentToClassrooms(String assignmentId, AssignmentClassroomRequest assignmentClassroomRequest) {
        Assignment assignment = findAssignmentById(assignmentId);

        for (String classroomId : assignmentClassroomRequest.getClassroomIdList()) {
            ClassroomEntity classroomEntity = classroomService.findClassroomByIdAndCurrentUserRole(classroomId);

            boolean alreadyAssigned = assignment.getClassroomList().stream()
                    .anyMatch(ac -> ac.getClassroomEntity().equals(classroomEntity));

            if (!alreadyAssigned) {
                AssignmentClassroomEntity assignmentClassroomEntity = AssignmentClassroomEntity.builder()
                        .assignment(assignment)
                        .classroomEntity(classroomEntity)
                        .assignedTime(LocalDateTime.now())
                        .status(AssignmentStatus.ASSIGNED)
                        .build();

                assignmentClassroomRepository.save(assignmentClassroomEntity);

                assignment.getClassroomList().add(assignmentClassroomEntity);
            }
        }
        assignmentRepository.save(assignment);
    }

    public void detachAssignmentFromClassroom(String classroomId, String assignmentId) {
        ClassroomEntity classroomEntity = classroomService.findClassroomById(classroomId);
        Assignment assignment = findAssignmentById(assignmentId);

        AssignmentClassroomEntity assignmentClassroomEntityToRemove = null;

        for (AssignmentClassroomEntity ac : classroomEntity.getAssignmentList()) {
            if (ac.getAssignment().equals(assignment)) {
                assignmentClassroomEntityToRemove = ac;
                break;
            }
        }

        if (assignmentClassroomEntityToRemove != null) {
            classroomEntity.getAssignmentList().remove(assignmentClassroomEntityToRemove);
            assignment.getClassroomList().remove(assignmentClassroomEntityToRemove);

            assignmentClassroomRepository.delete(assignmentClassroomEntityToRemove);

            assignmentRepository.save(assignment);
        } else {
            throw new ApplicationException(ExceptionMessageCode.CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT);
        }
    }




}
