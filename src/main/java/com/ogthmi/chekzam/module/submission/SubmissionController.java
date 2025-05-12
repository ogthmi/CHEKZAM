package com.ogthmi.chekzam.module.submission;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import com.ogthmi.chekzam.module.question.QuestionDTO;
import com.ogthmi.chekzam.module.submission.dto.SubmissionRequest;
import com.ogthmi.chekzam.module.submission.dto.SubmissionResponse;
import com.ogthmi.chekzam.module.submission_answer.dto.GradedAnswerResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submission")
@AllArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/submit")
    public ApiResponse<SubmissionResponse> submitAssignment (@RequestBody SubmissionRequest submissionRequest){
        return ApiResponse.success(
                submissionService.createSubmission(submissionRequest),
                SuccessMessageCode.CREATED_SUCCESSFULLY
        );
    }

    @GetMapping("/{submissionId}")
    public ApiResponse<SubmissionResponse> getSubmission (@PathVariable  String submissionId){
        return ApiResponse.success(
                submissionService.getSubmissionInfo(submissionId),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @GetMapping("/classroom/{classroomId}/assignment/{assignmentId}/all")
    public ApiResponse<Page<SubmissionResponse>> getAllSubmissionForAssignmentInClassroom(
            @PathVariable String classroomId,
            @PathVariable String assignmentId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ){
        return ApiResponse.success(
                submissionService.getAllSubmission(classroomId, assignmentId, pageNumber, pageSize, sortBy, direction),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("assignment/{assignmentId}/all")
    public ApiResponse<Page<SubmissionResponse>> getAllSubmissionForAssignmentInAllClassroom(
            @PathVariable String assignmentId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ){
        return ApiResponse.success(
                submissionService.getAllSubmissionForAssignmentOfAllClassrooms(assignmentId, pageNumber, pageSize, sortBy, direction),
                SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }


    @GetMapping("/{submissionId}/details")
    public ApiResponse<Page<QuestionDTO<GradedAnswerResponse>>> getSubmissionDetails (
            @PathVariable String submissionId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(defaultValue = "questionOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword
    ){
        return ApiResponse.success(
          submissionService.getSubmissionAnswerDetails(submissionId, pageNumber, pageSize, sortBy, direction, keyword),
          SuccessMessageCode.FETCHED_SUCCESSFULLY
        );
    }

    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/{submissionId}")
    public ApiResponse<Void> deleteSubmission (@PathVariable String submissionId){
        submissionService.deleteSubmission(submissionId);
        return ApiResponse.voidSuccess(SuccessMessageCode.DELETED_SUCCESSFULLY);
    }
}
