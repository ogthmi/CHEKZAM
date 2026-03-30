package com.ogthmi.chekzam.module.assignment.assignment_dto;

import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.answer.AnswerDTO;
import lombok.Data;

import java.util.List;

@Data
public class UpdateQuestionListRequest {
    List<String> deletedQuestions; //List of questionId;
    List<QuestionDTO<AnswerDTO>> editedQuestions;
    List<QuestionDTO<AnswerDTO>> newQuestions;
}
