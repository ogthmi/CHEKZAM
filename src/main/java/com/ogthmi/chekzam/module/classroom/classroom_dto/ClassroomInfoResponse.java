package com.ogthmi.chekzam.module.classroom.classroom_dto;

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
@EqualsAndHashCode(callSuper = true)
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
        private int totalAssignments;
        private int totalDocuments;
        private int totalMembers;
    }
}
