const SUBMISSION_FIELDS = {
    submissionId: { label: "Mã lần nộp", value: "submissionId" },
    assignmentId: { label: "Mã bài tập", value: "assignmentId" },
    assignmentName: { label: "Tên bài tập", value: "assignmentName" },
    classroomId: { label: "Mã lớp", value: "classroomId" },
    classroomName: { label: "Tên lớp", value: "classroomName" },
    userId: { label: "Mã học sinh", value: "userId" },
    fullName: { label: "Họ và tên", value: "fullName" },
    takingAttempt: { label: "Lượt làm", value: "takingAttempt" },
    startedAt: { label: "Bắt đầu", value: "startedAt" },
    submittedAt: { label: "Nộp bài", value: "submittedAt" },
    durationInSeconds: { label: "Thời gian làm (giây)", value: "durationInSeconds" },
    totalCorrectQuestions: { label: "Số câu đúng", value: "totalCorrectQuestions" },
    totalQuestions: { label: "Tổng số câu", value: "totalQuestions" },
    score: { label: "Điểm", value: "score" },
};

export const SubmissionFieldBuilder = {
    getFieldsByContext: (page, isTeacher) => {
        const fields = { ...SUBMISSION_FIELDS };

        // 1. Giáo viên ở trang bài tập tổng (ngoài lớp học)
        if (page === "assignment-page" && isTeacher === true) {
            delete fields.assignmentId;
            delete fields.assignmentName;
            delete fields.classroomId;
            delete fields.userId;
        }

        // 2. Giáo viên ở trang bài tập trong lớp
        if (page === "classroom-assignment-page" && isTeacher === true) {
            delete fields.assignmentId;
            delete fields.assignmentName;
            delete fields.classroomId;
            delete fields.classroomName;
            delete fields.userId;
        }

        // 3. Học sinh ở trang bài tập trong lớp
        if (page === "classroom-assignment-page" && isTeacher === false) {
            delete fields.assignmentId;
            delete fields.assignmentName;
            delete fields.classroomId;
            delete fields.classroomName;
            delete fields.fullName;
            delete fields.userId;
        }

        return fields;
    }
};
