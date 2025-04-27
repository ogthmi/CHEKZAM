package com.ogthmi.chekzam.repository;

import com.ogthmi.chekzam.entity.assignment.Assignment;
import com.ogthmi.chekzam.entity.assignment.AssignmentQuestion;
import com.ogthmi.chekzam.entity.assignment.AssignmentQuestionId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentQuestionRepository extends JpaRepository<AssignmentQuestion, AssignmentQuestionId> {
    Page<AssignmentQuestion> findByAssignment(Assignment assignment, Pageable pageable);

    Page<AssignmentQuestion> findByAssignmentAndQuestion_QuestionContentContainingIgnoreCase(
            Assignment assignment, String keyword, Pageable pageable
    );

}
