package com.ogthmi.chekzam.module.submission;

import com.ogthmi.chekzam.common.exception.ApplicationException;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import com.ogthmi.chekzam.common.util.PaginationUtil;
import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.assignment.AssignmentService;
import com.ogthmi.chekzam.module.assignment_classroom.AssignmentClassroomService;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionEntity;
import com.ogthmi.chekzam.module.assignment_question.AssignmentQuestionRepository;
import com.ogthmi.chekzam.module.classroom_student.ClassroomStudentRepository;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.submission.dto.SubmissionRequest;
import com.ogthmi.chekzam.module.submission.dto.SubmissionResponse;
import com.ogthmi.chekzam.module.submission_answer.SubmissionAnswerRepository;
import com.ogthmi.chekzam.module.submission_answer.dto.GradedAnswerResponse;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerEntity;
import com.ogthmi.chekzam.module.submission_answer.service.GradingAnswerService;
import com.ogthmi.chekzam.module.submission_answer.service.SubmissionAnswerService;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.user_service.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final SubmissionMapper submissionMapper;
    private final AssignmentClassroomService assignmentClassroomService;
    private final AssignmentService assignmentService;
    private final ClassroomStudentRepository classroomStudentRepository;
    private final UserService userService;
    private final GradingAnswerService gradingAnswerService;
    private final SubmissionAnswerService submissionAnswerService;
    private final AssignmentQuestionRepository assignmentQuestionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;

    private void isStudentInClassroom(String classroomId, String userId) {
        if (!classroomStudentRepository
                .existsByClassroomEntity_ClassroomIdAndUserEntity_UserId(classroomId, userId)) {
            throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
        }
    }

    @Transactional
    public SubmissionResponse createSubmission(SubmissionRequest submissionRequest) {
        UserEntity currentStudent = userService.findCurrentUser();
        AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomService
                .findAssignmentClassroomEntity(submissionRequest.getAssignmentId(), submissionRequest.getClassroomId());
        isStudentInClassroom(submissionRequest.getClassroomId(), currentStudent.getUserId());
        int currentAttempts = submissionRepository.countByAssignmentClassroomAndStudent(assignmentClassroomEntity, currentStudent);
        if (assignmentClassroomEntity.getMaxAttempts() != 0 && currentAttempts == assignmentClassroomEntity.getMaxAttempts()) {
            throw new ApplicationException(ExceptionMessageCode.MAX_ATTEMPTS_REACHED);
        }
        SubmissionEntity submission = submissionMapper.toSubmissionEntity(submissionRequest, assignmentClassroomEntity, currentStudent, currentAttempts + 1);
        submissionRepository.save(submission);
        submissionAnswerService.saveSubmittedAnswers(submission, submissionRequest.getStudentAnswerList());
        gradingAnswerService.updateCorrectAnswers(submission);
        return submissionMapper.toSubmissionResponse(submission);
    }

    public void deleteSubmission(String submissionId) {
        boolean existSubmission = submissionRepository.existsById(submissionId);
        if (!existSubmission) {
            throw new ApplicationException(ExceptionMessageCode.SUBMISSION_NOT_FOUND);
        }
        submissionRepository.deleteById(submissionId);
    }

    public SubmissionEntity findSubmissionById(String submissionId) {
        return submissionRepository.findById(submissionId).orElseThrow(() -> new ApplicationException(ExceptionMessageCode.SUBMISSION_NOT_FOUND));
    }

    public SubmissionResponse getSubmissionInfo(String submissionId) {
        return submissionMapper.toSubmissionResponse(findSubmissionById(submissionId));
    }

    public Page<SubmissionResponse> getAllSubmission(String classroomId, String assignmentId, int page, int size, String sortBy, String direction) {
        UserEntity currentUser = userService.findCurrentUser();
        Pageable pageable = PaginationUtil.buildPageable(page, size, sortBy, direction);

        AssignmentClassroomEntity assignmentClassroom = assignmentClassroomService
                .findAssignmentClassroomEntity(assignmentId, classroomId);

        Page<SubmissionEntity> submissionPage;

        if (currentUser.getRoles().stream().anyMatch(role -> role.equals(Role.ADMIN) || role.equals(Role.TEACHER))) {
            submissionPage = submissionRepository.findByAssignmentClassroom(assignmentClassroom, pageable);
        } else {
            submissionPage = submissionRepository.findByAssignmentClassroomAndStudent(assignmentClassroom, currentUser, pageable);
        }
        return submissionPage.map(submissionMapper::toSubmissionResponse);
    }

    public Page<SubmissionResponse> getAllSubmissionForAssignmentOfAllClassrooms(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction){
        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);
        AssignmentEntity assignment = assignmentService.findAssignmentById(assignmentId);
        Page<SubmissionEntity> submissionPage = submissionRepository.findByAssignmentClassroom_AssignmentEntity(assignment, pageable);
        return submissionPage.map(submissionMapper::toSubmissionResponse);

    }

    public Page<QuestionDTO<GradedAnswerResponse>> getSubmissionAnswerDetails(
            String submissionId, int pageNumber, int pageSize, String sortBy, String direction, String keyword
    ) {
        SubmissionEntity submission = findSubmissionById(submissionId);

        Pageable pageable = PaginationUtil.buildPageable(pageNumber, pageSize, sortBy, direction);

        Page<AssignmentQuestionEntity> pageAssignmentQuestions =
                assignmentQuestionRepository.findByAssignmentEntity(submission.getAssignmentClassroom().getAssignmentEntity(), pageable);

        List<SubmittedAnswerEntity> submittedAnswers = submissionAnswerRepository.findBySubmission(submission);

        List<QuestionDTO<GradedAnswerResponse>> questionDTOs = pageAssignmentQuestions.getContent().stream()
                .map(aq -> {
                    List<SubmittedAnswerEntity> submittedForThis = submittedAnswers.stream()
                            .filter(sa -> sa.getQuestionId().equals(aq.getQuestionEntity().getQuestionId()))
                            .collect(Collectors.toList());

                    return submissionAnswerService.convertToGradedQuestionResponse(aq, submittedForThis);
                })
                .toList();

        return new PageImpl<>(questionDTOs, pageable, pageAssignmentQuestions.getTotalElements());
    }


}
