package com.ogthmi.chekzam.module.assignment_question;

import com.ogthmi.chekzam.module.assignment.AssignmentEntity;
import com.ogthmi.chekzam.module.question.QuestionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestionEntity, AssignmentQuestionId> {

    long countByQuestionEntity(QuestionEntity questionEntity);

    Page<AssignmentQuestionEntity> findByAssignmentEntity(AssignmentEntity assignmentEntity, Pageable pageable);

    Page<AssignmentQuestionEntity> findByAssignmentEntityAndQuestionEntity_QuestionContentContainingIgnoreCase(
            AssignmentEntity assignmentEntity, String keyword, Pageable pageable
    );

}
