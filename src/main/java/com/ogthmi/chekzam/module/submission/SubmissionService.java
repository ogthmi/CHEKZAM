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

import java.time.Duration;
import java.time.LocalDateTime;
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
    public SubmissionResponse startSubmission(SubmissionRequest submissionRequest) {
        UserEntity currentUser = userService.findCurrentUser();
        boolean isTeacherSimulating = currentUser.getRoles().contains(Role.TEACHER);
        AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomService
                .findAssignmentClassroomEntity(submissionRequest.getAssignmentId(), submissionRequest.getClassroomId());

        if (LocalDateTime.now().isBefore(assignmentClassroomEntity.getOpenTime())){
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_NOT_YET_OPENED);
        }
        if (LocalDateTime.now().isAfter(assignmentClassroomEntity.getDueTime())){
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_ALREADY_CLOSED);
        }

        if (isTeacherSimulating) {
            boolean isClassroomTeacher = assignmentClassroomEntity.getClassroomEntity().getTeacher().equals(currentUser);
            if (!isClassroomTeacher) {
                throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
            }
        } else {
            isStudentInClassroom(submissionRequest.getClassroomId(), currentUser.getUserId());
        }

        int currentAttempts = submissionRepository.countByAssignmentClassroomAndStudent(assignmentClassroomEntity, currentUser);
        if (assignmentClassroomEntity.getMaxAttempts() != 0 && currentAttempts == assignmentClassroomEntity.getMaxAttempts()) {
            throw new ApplicationException(ExceptionMessageCode.MAX_ATTEMPTS_REACHED);
        }

        LocalDateTime startedAt = LocalDateTime.now();
        long durationMinutes = assignmentClassroomEntity.getDuration();
        LocalDateTime endTime = (durationMinutes > 0) ? startedAt.plus(Duration.ofMinutes(durationMinutes)) : null;

        SubmissionEntity submission = new SubmissionEntity();
        submission.setAssignmentClassroom(assignmentClassroomEntity);
        submission.setStudent(currentUser);
        submission.setTakingAttempt(currentAttempts + 1);
        submission.setStartedAt(startedAt);
        submission.setSubmittedAt(endTime);
        if (isTeacherSimulating) submission.setTeacherSimulating(true);

        submissionRepository.save(submission);

        return SubmissionResponse.builder()
                .submissionId(submission.getSubmissionId())
                .startedAt(submission.getStartedAt())
                .submittedAt(submission.getSubmittedAt())
                .takingAttempt(submission.getTakingAttempt())
                .build();
    }

    @Transactional
    public SubmissionResponse createSubmissionAndAnswer(SubmissionRequest submissionRequest) {
        UserEntity currentUser = userService.findCurrentUser();
        AssignmentClassroomEntity assignmentClassroomEntity = assignmentClassroomService
                .findAssignmentClassroomEntity(submissionRequest.getAssignmentId(), submissionRequest.getClassroomId());
        isStudentInClassroom(submissionRequest.getClassroomId(), currentUser.getUserId());

        SubmissionEntity submission = findSubmissionById(submissionRequest.getSubmissionId());

        if (submission.isTeacherSimulating()) {
            boolean isClassroomTeacher = assignmentClassroomEntity.getClassroomEntity().getTeacher().equals(currentUser);
            if (!isClassroomTeacher) {
                throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
            }
        }
        else {
            if (!submission.getStudent().getUserId().equals(currentUser.getUserId())) {
                throw new ApplicationException(ExceptionMessageCode.UNAUTHORIZED_ACCESS);
            }
        }

        if (submission.getStartedAt() == null) {
            throw new RuntimeException("Người dùng chưa bắt đầu làm bài.");
        }
        LocalDateTime now = LocalDateTime.now();
        if (submission.getSubmittedAt() != null && now.isAfter(submission.getSubmittedAt())) {
            submission.setSubmittedAt(null);
            submission.setLate(true);
            submissionRepository.save(submission);
            throw new ApplicationException(ExceptionMessageCode.ASSIGNMENT_ALREADY_CLOSED);
        }
        submission.setSubmittedAt(now);
        submission.calculateDuration();
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

    public Page<SubmissionResponse> getAllSubmissionForAssignmentOfAllClassrooms(String assignmentId, int pageNumber, int pageSize, String sortBy, String direction) {
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
