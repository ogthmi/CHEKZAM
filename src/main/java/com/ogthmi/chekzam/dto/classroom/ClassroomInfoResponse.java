package com.ogthmi.chekzam.dto.classroom;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClassroomInfoResponse extends  ClassroomInfoRequest{
    private String classroomId;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime createdAt;

    private ClassroomTeacher classroomTeacher;
    private ClassroomStatistic classroomStatistic;

    @Data
    @AllArgsConstructor
    @Builder
    public static class ClassroomTeacher {
        private String teacherId;
        private String firstName;
        private String lastName;
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
