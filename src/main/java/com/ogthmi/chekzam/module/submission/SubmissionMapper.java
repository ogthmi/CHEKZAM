package com.ogthmi.chekzam.module.submission;

import com.ogthmi.chekzam.common.util.IdGenerator;
import com.ogthmi.chekzam.module.assignment_classroom.entity.AssignmentClassroomEntity;
import com.ogthmi.chekzam.module.submission.dto.SubmissionRequest;
import com.ogthmi.chekzam.module.submission.dto.SubmissionResponse;
import com.ogthmi.chekzam.module.user.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public SubmissionEntity toSubmissionEntity(SubmissionRequest request, AssignmentClassroomEntity ac, UserEntity student, int attempt) {
        SubmissionEntity submission = SubmissionEntity.builder()
                .assignmentClassroom(ac)
                .student(student)
                .takingAttempt(attempt)
                .startedAt(request.getStartedAt())
                .submittedAt(request.getSubmittedAt())
                .build();
        submission.calculateDuration();
        return submission;
    }


    public SubmissionResponse toSubmissionResponse (SubmissionEntity submissionEntity){
        int totalQuestions = submissionEntity.getAssignmentClassroom().getAssignmentEntity().getQuestionList().size();
        double score = (submissionEntity.getTotalCorrectQuestions() * 10.0 / totalQuestions);
        return SubmissionResponse.builder()
                .submissionId(submissionEntity.getSubmissionId())
                .assignmentId(submissionEntity.getAssignmentClassroom().getAssignmentEntity().getAssignmentId())
                .assignmentName(submissionEntity.getAssignmentClassroom().getAssignmentEntity().getAssignmentName())
                .classroomId(submissionEntity.getAssignmentClassroom().getClassroomEntity().getClassroomId())
                .classroomName(submissionEntity.getAssignmentClassroom().getClassroomEntity().getClassroomName())
                .userId(submissionEntity.getStudent().getUserId())
                .fullName(
                        String.join(" ",
                                submissionEntity.getStudent().getLastName(),
                                submissionEntity.getStudent().getFirstName()
                        )
                )
                .takingAttempt(submissionEntity.getTakingAttempt())
                .totalCorrectQuestions(submissionEntity.getTotalCorrectQuestions())
                .startedAt(submissionEntity.getStartedAt())
                .submittedAt(submissionEntity.getSubmittedAt())
                .durationInSeconds(submissionEntity.getDurationInSeconds())
                .totalCorrectQuestions(submissionEntity.getTotalCorrectQuestions())
                .totalQuestions(totalQuestions)
                .score(score)
                .build();
    }
}
