package com.ogthmi.chekzam.common.message;

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
    PASSWORD_MISMATCH(2003,"Xác nhận mật khẩu không trùng khớp."),
    NEW_PASSWORD_IDENTICAL(2003,"Mật khẩu mới trùng mật khẩu cũ."),
    WEAK_PASSWORD(2004, "Mật khẩu quá yếu. Vui lòng nhập mật khẩu có ít nhất 8 ký tự."),
    PASSWORD_MISSING_UPPERCASE(2004, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa."),
    PASSWORD_MISSING_LOWERCASE(2004, "Mật khẩu phải chứa ít nhất một chữ cái viết thường."),
    PASSWORD_MISSING_NUMBER(2004, "Mật khẩu phải chứa ít nhất một chữ số."),
    PASSWORD_MISSING_SPECIAL_CHAR(2004, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt."),

    CREATE_TOKEN_FAILED(2201,"Tạo token thất bại."),
    TOKEN_EXPIRED (2202,"Token hết hạn."),
    NEED_REFRESH_TOKEN (2203, "Cần làm mới lại token"),



    EMAIL_ALREADY_EXIST(2301,"Email đã tồn tại"),
    EMAIL_AUTHENTICATION_FAILED(2302,"Xác thực email thất bại."),

    CLASSROOM_NOT_FOUND (3001,"Không tìm thấy lớp học."),
    STUDENT_NOT_IN_CLASS (3002,"Sinh viên không tồn tại trong lớp học."),

    ASSIGNMENT_NOT_FOUND (3101,"Không tìm thấy bài tập."),
    QUESTION_NOT_FOUND (3102,"Không tìm thấy câu hỏi"),
    ASSIGNMENT_NAME_EMPTY (3102,"Bài tập không có tên"),
    ASSIGNMENT_EMPTY (3102,"Bài tập không có câu hỏi"),
    QUESTION_CONTENT_EMPTY (3102,"Câu hỏi không có nội dung"),
    QUESTION_EMPTY (3102,"Câu hỏi không có đáp án"),
    QUESTION_CORRECT_ANSWER_NOT_FOUND (3102,"Câu hỏi không có đáp án đúng"),
    ANSWER_EMPTY (3102,"Đáp án không có nội dung"),
    CLASSROOM_NOT_ASSOCIATED_WITH_ASSIGNMENT(3103,"Bài tập không được giao cho lớp học."),
    ;
    private final int code;
    private final String message;
}
