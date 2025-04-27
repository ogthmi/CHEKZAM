package com.ogthmi.chekzam.exception.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ExceptionMessageCode {
    UNAUTHENTICATED (1401, "Người dùng chưa xác thực"),
    UNAUTHORIZED_ACCESS(1403, "Người dùng không có quyền truy cập"),
    INTERNAL_EXCEPTION(1999,"Có lỗi hệ thống đã xảy ra."),

    USER_NOT_FOUND(2001, "Không tìm thấy người dùng."),
    USER_ALREADY_EXIST(2002,"Tên người dùng đã tồn tại."),
    INCORRECT_PASSWORD(2003,"Sai mật khẩu."),
    WEAK_PASSWORD(2004,"Mật khẩu ít hơn 08 kí tự. Vui lòng đặt lại mật khẩu."),
    PASSWORD_MISMATCH(2005,"Xác nhận mật khẩu không trùng khớp."),

    CREATE_TOKEN_FAILED(2201,"Tạo token thất bại."),
    TOKEN_EXPIRED (2202,"Token hết hạn."),
    NEED_REFRESH_TOKEN (2203, "Cần làm mới lại token"),

    EMAIL_ALREADY_EXIST(2301,"Email đã tồn tại"),
    EMAIL_AUTHENTICATION_FAILED(2302,"Xác thực email thất bại."),

    CLASSROOM_NOT_FOUND (3001,"Không tìm thấy lớp học."),
    STUDENT_NOT_IN_CLASS (3002,"Sinh viên không tồn tại trong lớp học."),

    ASSIGNMENT_NOT_FOUND (3101,"Không tìm thấy bài tập."),
    QUESTION_EMPTY (3102,"Bài tập không có câu hỏi"),
    ANSWER_EMPTY (3102,"Câu hỏi không có đáp án"),
    ;
    private final int code;
    private final String message;
}
