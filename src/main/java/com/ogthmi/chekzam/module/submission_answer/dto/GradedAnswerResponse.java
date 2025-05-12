package com.ogthmi.chekzam.module.submission_answer.dto;

import com.ogthmi.chekzam.module.answer.AnswerDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class GradedAnswerResponse extends AnswerDTO {
    private boolean isSelectedByStudent;
}
