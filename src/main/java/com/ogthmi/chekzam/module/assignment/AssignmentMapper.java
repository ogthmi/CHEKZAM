package com.ogthmi.chekzam.module.assignment;

import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentRequest;
import com.ogthmi.chekzam.module.question.QuestionMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AssignmentMapper {
    private final QuestionMapper questionMapper;

    public Assignment toAssignment(AssignmentRequest assignmentRequest) {
        return Assignment.builder()
                .assignmentName(assignmentRequest.getAssignmentName())
                .description(assignmentRequest.getDescription())
                .assignmentType(assignmentRequest.getAssignmentType())
                .duration(assignmentRequest.getDuration())
                .maxAttempts(assignmentRequest.getMaxAttempts())
                .startTime(assignmentRequest.getStartTime())
                .endTime(assignmentRequest.getEndTime())
                .build();
    }

    private AssignmentResponse.AssignmentTeacher toAssignmentTeacher (Assignment assignment){
        return AssignmentResponse.AssignmentTeacher.builder()
                .teacherId(assignment.getTeacher().getUserId())
                .firstName(assignment.getTeacher().getFirstName())
                .lastName(assignment.getTeacher().getLastName())
                .build();
    }

    public AssignmentResponse toAssignmentInfoResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .description(assignment.getDescription())
                .assignmentType(assignment.getAssignmentType())
                .createdAt(assignment.getCreatedAt())
                .duration(assignment.getDuration())
                .maxAttempts(assignment.getMaxAttempts())
                .totalQuestions(assignment.getQuestionList() != null ? assignment.getQuestionList().size() : 0)
                .startTime(assignment.getStartTime())
                .endTime(assignment.getEndTime())
                .assignmentTeacher(toAssignmentTeacher(assignment))
                .build();
    }
}
