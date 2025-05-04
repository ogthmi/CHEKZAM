package com.ogthmi.chekzam.module.assignment_question;

import com.ogthmi.chekzam.module.assignment.Assignment;
import com.ogthmi.chekzam.module.question.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestionEntity, AssignmentQuestionId> {

    long countByQuestion(Question question);

    Page<AssignmentQuestionEntity> findByAssignment(Assignment assignment, Pageable pageable);

    Page<AssignmentQuestionEntity> findByAssignmentAndQuestion_QuestionContentContainingIgnoreCase(
            Assignment assignment, String keyword, Pageable pageable
    );

}
