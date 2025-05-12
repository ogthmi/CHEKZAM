package com.ogthmi.chekzam.module.submission_answer;

import com.ogthmi.chekzam.module.submission.SubmissionEntity;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerEntity;
import com.ogthmi.chekzam.module.submission_answer.entity.SubmittedAnswerId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionAnswerRepository extends JpaRepository<SubmittedAnswerEntity, SubmittedAnswerId> {
    Page<SubmittedAnswerEntity> findBySubmission_SubmissionId (String submissionId, Pageable pageable);
    List<SubmittedAnswerEntity> findBySubmission (SubmissionEntity submission);
}
