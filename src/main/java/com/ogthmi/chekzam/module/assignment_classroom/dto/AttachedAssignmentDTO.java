package com.ogthmi.chekzam.module.assignment_classroom.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ogthmi.chekzam.module.assignment.assignment_dto.AssignmentResponse;
import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentType;
import com.ogthmi.chekzam.module.classroom.classroom_dto.ClassroomInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AttachedAssignmentDTO {
    private String assignmentId;
    private String assignmentName;
    private String description;
    private AssignmentType assignmentType;
    private Integer totalQuestions;

    private String classroomId;
    private String classroomName;

    private int duration;
    private int maxAttempts;
    private boolean isShuffleEnabled;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime assignedTime;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime openTime;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime dueTime;
}

