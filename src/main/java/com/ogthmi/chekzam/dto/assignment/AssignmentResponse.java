package com.ogthmi.chekzam.dto.assignment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;


@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentResponse extends AssignmentRequest{


    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime createdAt;

    private int totalQuestions;

    private AssignmentTeacher assignmentTeacher;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AssignmentTeacher {
        private String teacherId;
        private String firstName;
        private String lastName;
    }
}
