package com.ogthmi.chekzam.module.assignment_classroom.dto;

import com.ogthmi.chekzam.module.assignment.assignment_enum.AssignmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentClassroomRequest {
    private List<AssignmentClassroomRecord> assignmentClassroomRecordList;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AssignmentClassroomRecord {
        private String assignmentId;
        private String classroomId;
        private LocalDateTime openTime;
        private LocalDateTime dueTime;
        private AssignmentStatus status;
    }
}

