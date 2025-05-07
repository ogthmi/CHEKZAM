export const ResponseDataFields = {
    ClassroomInfo: (isTeacher) => ({
        classroomId: {label: "Mã lớp", value: "classroomId"},
        classroomName: {label: "Tên lớp", value: "classroomName"},
        ...(isTeacher && {createdAt: {label: "Thời gian tạo", value: "createdAt"}}),
        totalMember: {label: "Sĩ số", value: "classroomStatistic.totalMembers"},
        totalAssignment: {label: "Bài tập", value: "classroomStatistic.totalAssignments"},
        totalDocument: {label: "Tài liệu", value: "classroomStatistic.totalDocuments"},
    }),

    AssignmentInfo: (isTeacher) => ({
        assignmentId: {label: "Mã bài tập", value: "assignmentId"},
        assignmentName: {label: "Tên bài tập", value: "assignmentName"},
        assignmenType: {label: "Loại bài tập", value: "assignmentType"},
        ...(isTeacher && {createdAt: {label: "Thời gian tạo", value: "createdAt"}}),
        totalQuestions: {label: "Số câu hỏi", value: "totalQuestions"},
    }),

    UserInfo: (showHiddenProfile) => ({
        userId: {label: "Mã người dùng", value: "userId"},
        ...(showHiddenProfile && {username: {label: "Tài khoản", value: "username"}}),
        lastName: {label: "Họ đệm", value: "lastName"},
        firstName: {label: "Tên", value: "firstName"},
        birthdate: {label: "Ngày sinh", value: "birthdate"},
        ...(showHiddenProfile && {role: {label: "Chức vụ chính", value: "roles[0]"}}),
        ...(!showHiddenProfile && {school: {label: "Trường", value: "school"}}),
        ...(!showHiddenProfile && {department: {label: "Lớp/Khoa", value: "department"}}),
        email: {label: "Email", value: "email"},
        ...(showHiddenProfile && {createdAt: {label: "Thời gian tạo", value: "createdAt"}}),
    }),
}