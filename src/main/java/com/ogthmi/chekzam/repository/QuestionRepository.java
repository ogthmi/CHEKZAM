package com.ogthmi.chekzam.repository;

import com.ogthmi.chekzam.entity.assignment.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
}
