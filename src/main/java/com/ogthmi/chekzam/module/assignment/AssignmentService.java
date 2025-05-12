package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.common.util.IdGenerator;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import com.ogthmi.chekzam.module.answer.AnswerEntity;
import com.ogthmi.chekzam.module.answer.AnswerRepository;
import com.ogthmi.chekzam.module.assignment.assignment_dto.UpdateQuestionListRequest;
import com.ogthmi.chekzam.module.question.*;
import com.ogthmi.chekzam.module.submission.SubmissionRepository;
import com.ogthmi.chekzam.module.answer.AnswerDTO;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionRepository;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionService;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final SubmissionRepository submissionRepository;

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
        String assignmentName = assignmentRequest.getAssignmentName();
        if (assignmentName == null || assignmentName.isBlank()) {
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NAME_EMPTY);
        }
        AssignmentEntity newAssignmentEntity = assignmentMapper.toAssignment(assignmentRequest);
        newAssignmentEntity.setTeacher(userService.findCurrentUser());
        newAssignmentEntity.setCreatedAt(LocalDateTime.now());

        assignmentRepository.save(newAssignmentEntity);
        assignmentQuestionService.attachQuestionsToAssignment(newAssignmentEntity, assignmentRequest.getQuestionList());

        return assignmentMapper.toAssignmentInfoResponse(newAssignmentEntity);
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


    @Transactional
    public void deleteAssignment(String assignmentId) {
        AssignmentEntity assignmentEntity = findAssignmentByIdAndCurrentUserRole(assignmentId);
        List<QuestionEntity> questionsToCheck = assignmentQuestionService.extractAllQuestions(assignmentEntity);
        submissionRepository.deleteByAssignmentClassroom_AssignmentEntity(assignmentEntity);
        assignmentRepository.delete(assignmentEntity);
        for (QuestionEntity questionEntity : questionsToCheck) {
            long count = assignmentQuestionRepository.countByQuestionEntity(questionEntity);
            if (count == 0) {
                questionService.deleteQuestion(questionEntity);
            }
        }
    }

    @Transactional
    public void updateQuestionList(String assignmentId, UpdateQuestionListRequest request) {
        AssignmentEntity assignment = findAssignmentById(assignmentId);

        if (request.getDeletedQuestions() != null) {
            for (String questionId : request.getDeletedQuestions()) {
                assignmentQuestionRepository.deleteByAssignmentEntity_AssignmentIdAndQuestionEntity_QuestionId(assignmentId, questionId);
                questionRepository.deleteById(questionId);
            }
        }

        if (request.getNewQuestions() != null) {
            for (QuestionDTO<AnswerDTO> questionDTO : request.getNewQuestions()) {
                questionService.validateQuestion(questionDTO);
                QuestionEntity question = new QuestionEntity();
                question.setQuestionId(IdGenerator.generateRandomId());
                question.setQuestionContent(questionDTO.getQuestionContent());

                List<AnswerEntity> answers = questionDTO.getAnswerList().stream().map(dto -> {
                    AnswerEntity answer = new AnswerEntity();
                    answer.setAnswerContent(dto.getAnswerContent());
                    answer.setCorrect(dto.isCorrect());
                    answer.setQuestionEntity(question);
                    return answer;
                }).collect(Collectors.toList());
                for (int i = 0; i < answers.size(); i++) {
                    answers.get(i).setAnswerOrder(i + 1);
                }
                question.setAnswerEntityList(answers);
                questionRepository.save(question);

                AssignmentQuestionEntity link = new AssignmentQuestionEntity();
                link.setAssignmentEntity(assignment);
                link.setQuestionEntity(question);
                assignmentQuestionRepository.save(link);
            }
        }
        if (request.getEditedQuestions() != null) {
            for (QuestionDTO<AnswerDTO> questionDTO : request.getEditedQuestions()) {
                QuestionEntity question = questionService.findQuestionById(questionDTO.getQuestionId());

                question.setQuestionContent(questionDTO.getQuestionContent());

                List<AnswerEntity> currentAnswerList = answerRepository.findByQuestionEntity_QuestionId(question.getQuestionId());
                Map<String, AnswerEntity> currentMap = currentAnswerList.stream()
                        .filter(a -> a.getAnswerId() != null)
                        .collect(Collectors.toMap(AnswerEntity::getAnswerId, Function.identity()));

                List<AnswerEntity> updatedAnswers = new ArrayList<>();

                for (AnswerDTO dto : questionDTO.getAnswerList()) {
                    if (dto.getAnswerId() != null && currentMap.containsKey(dto.getAnswerId())) {
                        // Cập nhật đáp án cũ
                        AnswerEntity a = currentMap.get(dto.getAnswerId());
                        a.setAnswerContent(dto.getAnswerContent());
                        a.setCorrect(dto.isCorrect());
                        updatedAnswers.add(a);
                        currentMap.remove(dto.getAnswerId()); // đánh dấu đã xử lý
                    } else {
                        // Thêm đáp án mới
                        AnswerEntity a = new AnswerEntity();
                        a.setAnswerContent(dto.getAnswerContent());
                        a.setCorrect(dto.isCorrect());
                        a.setQuestionEntity(question);
                        updatedAnswers.add(a);
                    }
                }
                for (int i = 0; i < updatedAnswers.size(); i++) {
                    updatedAnswers.get(i).setAnswerOrder(i + 1);
                }
                question.getAnswerEntityList().clear();
                question.getAnswerEntityList().addAll(updatedAnswers);

                questionRepository.save(question);
            }
        }
        List<AssignmentQuestionEntity> allAssignmentQuestions = assignmentQuestionRepository
                .findByAssignmentEntity_AssignmentId(assignmentId);

        allAssignmentQuestions.sort(
                Comparator.comparing(
                        AssignmentQuestionEntity::getQuestionOrder,
                        Comparator.nullsLast(Comparator.naturalOrder())
                )
        );

        for (int i = 0; i < allAssignmentQuestions.size(); i++) {
            allAssignmentQuestions.get(i).setQuestionOrder(i + 1);
        }
        assignmentQuestionRepository.saveAll(allAssignmentQuestions);
    }
}
