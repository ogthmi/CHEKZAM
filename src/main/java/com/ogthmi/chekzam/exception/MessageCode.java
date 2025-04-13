package com.ogthmi.chekzam.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum MessageCode {
    UNAUTHENTICATED (9401, "Người dùng chưa xác thực"),
    UNAUTHORIZED_ACCESS(9403, "Người dùng không có quyền truy cập"),
    INTERNAL_EXCEPTION(9999, "Có lỗi hệ thống đã xảy ra."),

    USER_NOT_FOUND(2001, "Không tìm thấy người dùng."),
    USER_ALREADY_EXIST(2002, "Tên người dùng đã tồn tại."),
    INCORRECT_PASSWORD(2003, "Sai mật khẩu."),
    WEAK_PASSWORD(2004, "Mật khẩu ít hơn 08 kí tự. Vui lòng đặt lại mật khẩu."),
    PASSWORD_MISMATCH(2005, "Xác nhận mật khẩu không trùng khớp."),

    SIGNED_OUT_SUCCESSFULLY(2100, "Đăng xuất thành công"),

    CREATE_TOKEN_FAILED(2201, "Tạo token thất bại."),
    TOKEN_EXPIRED (2201, "Token hết hạn"),

    EMAIL_ALREADY_EXIST(4001, "Email đã tồn tại"),
    EMAIL_AUTHENTICATION_FAILED(4002, "Xác thực email thất bại."),

    CLASSROOM_NOT_FOUND (5000, "Không tìm thấy lớp học"),


    ;
    private final int code;
    private final String message;
}
