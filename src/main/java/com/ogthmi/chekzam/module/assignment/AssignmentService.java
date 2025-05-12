package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import com.ogthmi.chekzam.module.submission_answer.dto.AnswerDTO;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionRepository;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionService;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.module.question.QuestionMapper;
import com.ogthmi.chekzam.module.question.QuestionService;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.user_service.UserService;
import jakarta.transaction.Transactional;
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
    private final AssignmentQuestionService assignmentQuestionService;
    private final UserService userService;
    private final QuestionService questionService;
    private final AssignmentMapper assignmentMapper;
    private final QuestionMapper questionMapper;

    //Find Assignment
    public AssignmentEntity findAssignmentById(String assignmentId) {
        return assignmentRepository.findById(assignmentId).orElseThrow(
                () -> new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NOT_FOUND)
        );
    }

    public AssignmentEntity findAssignmentByIdAndCurrentUserRole(String assignmentId) {
        AssignmentEntity assignment = findAssignmentById(assignmentId);
        UserEntity user = userService.findCurrentUser();
        if (!hasAccessToAssignment(user, assignment)) {
            log.warn("Unauthorized access attempt by user {} to assignmentEntity {}", user.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return assignment;
    }

    public boolean hasAccessToAssignment(UserEntity user, AssignmentEntity assignment) {
        List<Role> roles = user.getRoles();
        if (roles.contains(Role.ADMIN)) return true;
        if (roles.contains(Role.TEACHER)) {
            return assignment.getTeacher().equals(user);
        }
        if (roles.contains(Role.STUDENT)) {
            return user.getClassroomList().stream()
                    .anyMatch(classroomStudentEntity -> classroomStudentEntity
                            .getClassroomEntity()
                            .getAssignmentList()
                            .stream()
                            .anyMatch(assignmentClassroomEntity -> assignmentClassroomEntity
                                    .getAssignmentEntity()
                                    .equals(assignment)
                            ));
        }
        return false;
    }

    //Find All Assignments
    public Page<AssignmentResponse> getAllAssignmentsByCurrentTeacher(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentTeacher = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<AssignmentEntity> assignmentPage = assignmentRepository
                .findByTeacherAndAssignmentNameContainingIgnoreCase(currentTeacher, keyword, pageable);
        return assignmentPage.map(assignmentMapper::toAssignmentInfoResponse);
    }

    //Create Assignment
    @Transactional
    public AssignmentResponse createNewAssignment(AssignmentRequest assignmentRequest) {
        validateAttachAssignmentRequest(assignmentRequest);

        AssignmentEntity newAssignmentEntity = assignmentMapper.toAssignment(assignmentRequest);
        newAssignmentEntity.setTeacher(userService.findCurrentUser());
        newAssignmentEntity.setCreatedAt(LocalDateTime.now());

        assignmentRepository.save(newAssignmentEntity);
        assignmentQuestionService.attachQuestionsToAssignment(newAssignmentEntity, assignmentRequest.getQuestionList());

        return assignmentMapper.toAssignmentInfoResponse(newAssignmentEntity);
    }

    private void validateAttachAssignmentRequest(AssignmentRequest assignmentRequest) {
        String assignmentName = assignmentRequest.getAssignmentName();
        if (assignmentName == null || assignmentName.isBlank()) {
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NAME_EMPTY);
        }
        questionService.validateQuestionList(assignmentRequest.getQuestionList());
    }

    //Extract Assignment
    public AssignmentResponse getAssignmentInfo(String assignmentId) {
        AssignmentEntity assignmentEntity = findAssignmentByIdAndCurrentUserRole(assignmentId);
        return assignmentMapper.toAssignmentInfoResponse(assignmentEntity);
    }

    public Page<QuestionDTO<AnswerDTO>> getAssignmentQuestions(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        AssignmentEntity assignmentEntity = findAssignmentByIdAndCurrentUserRole(assignmentId);
        UserEntity currentUser = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);

        Page<AssignmentQuestionEntity> questionPage = (keyword == null || keyword.isBlank())
                ? assignmentQuestionRepository.findByAssignmentEntity(assignmentEntity, pageable)
                : assignmentQuestionRepository.findByAssignmentEntityAndQuestionEntity_QuestionContentContainingIgnoreCase(assignmentEntity, keyword, pageable);

        return questionPage.map(
                canViewCorrectAnswers(currentUser)
                        ? questionMapper::toQuestionDTO
                        : questionMapper::toQuestionDTOHideCorrectAnswer
        );
    }
    private boolean canViewCorrectAnswers(UserEntity user) {
        return user.getRoles().stream().anyMatch(role -> role == Role.TEACHER || role == Role.ADMIN);
    }

    //Update
    @Transactional
    public void updateAssignmentInfo(String assignmentId, AssignmentRequest assignmentRequest) {
        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);

        assignmentEntity.setAssignmentName(assignmentRequest.getAssignmentName());
        assignmentEntity.setDescription(assignmentRequest.getDescription());
        assignmentQuestionService.updateAssignmentQuestions(assignmentRequest.getQuestionList());
        assignmentRepository.save(assignmentEntity);
        log.info("Cập nhật bài tập {} thành công", assignmentId);
    }

    @Transactional
    public void deleteAssignment(String assignmentId) {
        AssignmentEntity assignmentEntity = findAssignmentByIdAndCurrentUserRole(assignmentId);
        List<QuestionEntity> questionsToCheck = assignmentQuestionService.extractAllQuestions(assignmentEntity);
        assignmentRepository.delete(assignmentEntity);
        for (QuestionEntity questionEntity : questionsToCheck) {
            long count = assignmentQuestionRepository.countByQuestionEntity(questionEntity);
            if (count == 0) {
                questionService.deleteQuestion(questionEntity);
            }
        }
    }
}
