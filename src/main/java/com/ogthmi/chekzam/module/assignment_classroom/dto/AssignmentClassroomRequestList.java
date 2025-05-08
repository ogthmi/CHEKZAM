package com.ogthmi.chekzam.module.assignment_classroom.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentClassroomRequestList {
    private List<AssignmentClassroomRequest> assignmentClassroomRequestList;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AssignmentClassroomRequest {
        private String assignmentId;
        private String classroomId;
        private int duration; //MINUTES
        private int maxAttempts;

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        private LocalDateTime openTime;

        @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
        private LocalDateTime dueTime;
    }
}

