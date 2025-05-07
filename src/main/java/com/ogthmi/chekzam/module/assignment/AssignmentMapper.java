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

    public AssignmentEntity toAssignment(AssignmentRequest assignmentRequest) {
        return AssignmentEntity.builder()
                .assignmentName(assignmentRequest.getAssignmentName())
                .description(assignmentRequest.getDescription())
                .assignmentType(assignmentRequest.getAssignmentType())
                .build();
    }

    private AssignmentResponse.AssignmentTeacher toAssignmentTeacher (AssignmentEntity assignment){
        return AssignmentResponse.AssignmentTeacher.builder()
                .teacherId(assignment.getTeacher().getUserId())
                .firstName(assignment.getTeacher().getFirstName())
                .lastName(assignment.getTeacher().getLastName())
                .build();
    }

    public AssignmentResponse toAssignmentInfoResponse(AssignmentEntity assignment) {
        return AssignmentResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .description(assignment.getDescription())
                .assignmentType(assignment.getAssignmentType())
                .createdAt(assignment.getCreatedAt())
                .totalQuestions(assignment.getQuestionList() == null? 0 : assignment.getQuestionList().size())
                .assignmentTeacher(toAssignmentTeacher(assignment))
                .build();
    }
}
