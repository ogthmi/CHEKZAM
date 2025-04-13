package com.ogthmi.chekzam.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClassroomResponse {
    private String classroomId;
    private String classroomName;
    private String description;
    private String createdAt;

    private ClassroomTeacher classroomTeacher;
    private ClassroomStatistic classroomStatistic;

    @Data
    @AllArgsConstructor
    @Builder
    public static class ClassroomTeacher {
        private String teacherId;
        private String teacherName;
    }

    @Data
    @AllArgsConstructor
    @Builder
    public static class ClassroomStatistic {
        private int totalExercises;
        private int totalDocuments;
        private int totalMembers;
    };
}
