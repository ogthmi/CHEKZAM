package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.question.QuestionService;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.module.question.QuestionMapper;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionRepository;
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
    private final UserService userService;
    private final QuestionService questionService;
    private final AssignmentMapper assignmentMapper;
    private final QuestionMapper questionMapper;

    public AssignmentEntity findAssignmentById(String assignmentId) {
        return assignmentRepository.findById(assignmentId).orElseThrow(
                () -> new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NOT_FOUND)
        );
    }


    private void validateAssignmentRequest(AssignmentRequest assignmentRequest) {
        String assignmentName = assignmentRequest.getAssignmentName();
        if (assignmentName == null || assignmentName.isBlank()) {
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NAME_EMPTY);
        }

        List<QuestionDTO> questionList = assignmentRequest.getQuestionList();
        if (questionList == null || questionList.isEmpty()) {
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_EMPTY);
        }

        for (int questionIndex = 0; questionIndex < questionList.size(); questionIndex++) {
            QuestionDTO questionDTO = questionList.get(questionIndex);
            String questionContent = questionDTO.getQuestionContent();

            if (questionContent == null || questionContent.isBlank()) {
                throw new ApplicationException(ExceptionMessageCode.QUESTION_CONTENT_EMPTY);
            }

            List<AnswerDTO> answerList = questionDTO.getAnswerList();
            if (answerList == null || answerList.isEmpty()) {
                throw new ApplicationException(ExceptionMessageCode.QUESTION_EMPTY);
            }

            boolean hasCorrectAnswer = false;
            for (int answerIndex = 0; answerIndex < answerList.size(); answerIndex++) {
                AnswerDTO answerDTO = answerList.get(answerIndex);
                String answerContent = answerDTO.getAnswerContent();

                if (answerContent == null || answerContent.isBlank()) {
                    throw new ApplicationException(ExceptionMessageCode.ANSWER_EMPTY);
                }

                if (answerDTO.isCorrect()) {
                    hasCorrectAnswer = true;
                }
            }
            if (!hasCorrectAnswer) {
                throw new ApplicationException(ExceptionMessageCode.QUESTION_CORRECT_ANSWER_NOT_FOUND);
            }
        }
    }

    public AssignmentResponse createNewAssignment(AssignmentRequest assignmentRequest) {
        validateAssignmentRequest(assignmentRequest);

        AssignmentEntity newAssignmentEntity = assignmentMapper.toAssignment(assignmentRequest);
        newAssignmentEntity.setTeacher(userService.findCurrentUser());
        newAssignmentEntity.setCreatedAt(LocalDateTime.now());

        assignmentRepository.save(newAssignmentEntity);

        if (assignmentRequest.getQuestionList() == null) {
            throw new ApplicationException(ExceptionMessageCode.QUESTION_EMPTY);
        }

        int order = 1;
        for (QuestionDTO questionRequest : assignmentRequest.getQuestionList()) {
            QuestionEntity questionEntity = questionService.saveQuestionWithAnswer(questionRequest);
            AssignmentQuestionEntity assignmentQuestionEntity = AssignmentQuestionEntity.builder()
                    .assignmentEntity(newAssignmentEntity)
                    .questionEntity(questionEntity)
                    .questionOrder(order++)
                    .build();
            assignmentQuestionRepository.save(assignmentQuestionEntity);
        }
        return assignmentMapper.toAssignmentInfoResponse(newAssignmentEntity);
    }

    private boolean hasAccessToAssignment(UserEntity userEntity, AssignmentEntity assignmentEntity) {
        List<Role> roles = userEntity.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return true;
        }
        if (roles.contains(Role.TEACHER)) {
            return assignmentEntity.getTeacher().getUserId().equals(userEntity.getUserId());
        }
        if (roles.contains(Role.STUDENT)) {
            return userEntity.getClassroomList().stream()
                    .map(ClassroomStudentEntity::getClassroomEntity)
                    .flatMap(classroom -> classroom.getAssignmentList().stream())
                    .anyMatch(ac -> ac.getAssignmentEntity().getAssignmentId()
                            .equals(assignmentEntity.getAssignmentId()));
        }

        return false;
    }

    public AssignmentResponse getAssignmentInfo(String assignmentId) {
        UserEntity currentUserEntity = userService.findCurrentUser();
        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);
        if (!hasAccessToAssignment(currentUserEntity, assignmentEntity)) {
            log.warn("Unauthorized access attempt by user {} to assignmentEntity {}", currentUserEntity.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        return assignmentMapper.toAssignmentInfoResponse(assignmentEntity);
    }

    public Page<QuestionDTO> getAssignmentQuestions(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentUserEntity = userService.findCurrentUser();
        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        if (!hasAccessToAssignment(currentUserEntity, assignmentEntity)) {
            log.warn("Unauthorized access attempt by user {} to assignmentEntity {}", currentUserEntity.getUserId(), assignmentId);
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
        Page<AssignmentQuestionEntity> questionPage;
        if (keyword == null || keyword.isBlank()) {
            questionPage = assignmentQuestionRepository.findByAssignmentEntity(assignmentEntity, pageable);
        } else
            questionPage = assignmentQuestionRepository.findByAssignmentEntityAndQuestionEntity_QuestionContentContainingIgnoreCase(assignmentEntity, keyword, pageable);
        return questionPage.map(questionMapper::toQuestionDTO);
    }

    public void updateAssignmentInfo(String assignmentId, AssignmentRequest assignmentRequest) {
        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);

        assignmentEntity.setAssignmentName(assignmentRequest.getAssignmentName());
        assignmentEntity.setDescription(assignmentRequest.getDescription());
        assignmentRepository.save(assignmentEntity);

        for (QuestionDTO questionRequest : assignmentRequest.getQuestionList()) {
            questionService.updateQuestionWithAnswer(questionRequest);
        }
        log.info("Cập nhật bài tập {} thành công", assignmentId);
    }

    public Page<AssignmentResponse> getAllAssignmentsByCurrentTeacher(int pageNumber, int pageSize, String sortBy, String direction, String keyword) {
        UserEntity currentTeacher = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        Page<AssignmentEntity> assignmentPage = assignmentRepository
                .findByTeacherAndAssignmentNameContainingIgnoreCase(currentTeacher, keyword, pageable);
        return assignmentPage.map(assignmentMapper::toAssignmentInfoResponse);
    }

    public void deleteAssignment(String assignmentId) {
        AssignmentEntity assignmentEntity = findAssignmentById(assignmentId);

        List<QuestionEntity> questionsToCheck = assignmentEntity.getQuestionList().stream()
                .map(AssignmentQuestionEntity::getQuestionEntity)
                .distinct()
                .toList();

        assignmentRepository.delete(assignmentEntity);

        for (QuestionEntity questionEntity : questionsToCheck) {
            long count = assignmentQuestionRepository.countByQuestionEntity(questionEntity);
            if (count == 0) {
                questionService.deleteQuestion(questionEntity);
            }
        }
    }
}
