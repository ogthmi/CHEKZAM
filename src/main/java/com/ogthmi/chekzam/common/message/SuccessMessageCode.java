package com.ogthmi.chekzam.common.message;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SuccessMessageCode {
    SIGNED_IN_SUCCESSFULLY(9200, "Đăng nhập thành công"),
    SIGNED_UP_SUCCESSFULLY(9200, "Đăng ký người dùng thành công"),
    SIGNED_OUT_SUCCESSFULLY(9200, "Đăng xuất thành công."),
    REFRESHED_TOKEN_SUCCESSFULLY(9200, "Làm mới token thành công."),

    FETCHED_SUCCESSFULLY(9200, "Lấy dữ liệu thành công."),
    ASSIGNED_SUCCESSFULLY(9200, "Gán dữ liệu thành công."),
    CREATED_SUCCESSFULLY(9200, "Tạo mới thành công"),
    UPDATED_SUCCESSFULLY(9200, "Cập nhật dữ liệu thành công."),
    DELETED_SUCCESSFULLY(9200, "Xóa dữ liệu thành công.")

    ;
    private final int code;
    private final String message;
}
