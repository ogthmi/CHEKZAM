const GENERAL_INFO_FIELDS = {
    assignmentId: {label: "Mã bài tập", value: "assignmentId"},
    assignmentName: {label: "Tên bài tập", value: "assignmentName"},
    assignmentType: {label: "Loại bài tập", value: "assignmentType"},
    createdAt: {label: "Thời gian tạo", value: "createdAt"},
    totalQuestions: {label: "Số câu hỏi", value: "totalQuestions"},
};

const ATTACHED_CLASSROOM_FIELDS = {
    classroomId: {label: "Mã lớp", value: "classroomId"},
    classroomName: {label: "Tên lớp", value: "classroomName"},
};

const CLASSROOM_ASSIGNMENT_FIELDS = {
    assignmentId: {label: "Mã bài tập", value: "assignmentId"},
    assignmentName: {label: "Tên bài tập", value: "assignmentName"},
    totalQuestions: {label: "Số câu hỏi", value: "totalQuestions"},
};

const COMMON_LINK_FIELDS = {
    assignedTime: {label: "Thời gian giao", value: "assignedTime"},
    duration: {label: "Thời lượng", value: "duration"},
    maxAttempts: {label: "Số lượt", value: "maxAttempts"},
    openTime: {label: "Bắt đầu", value: "openTime"},
    dueTime: {label: "Hạn chót", value: "dueTime"},
};

export const AssignmentFieldBuilder = {
    getGeneralInfoFields: (showHidden) => {
        const fields = {...GENERAL_INFO_FIELDS};
        if (!showHidden) {
            delete fields.createdAt;
        }
        return fields;
    },

    getAssignmentClassroomLinkFields: (page) => {
        const pageSpecificFields = {
            'attached-assignment': ATTACHED_CLASSROOM_FIELDS,
            'classroom-assignment': CLASSROOM_ASSIGNMENT_FIELDS,
        }
        return {
            ...pageSpecificFields,
            ...COMMON_LINK_FIELDS,
        };
    },
};
