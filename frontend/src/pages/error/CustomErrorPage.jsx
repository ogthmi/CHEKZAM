import { HttpErrorPage } from "./HttpErrorPage";

export const Error403 = () => {
    return <HttpErrorPage
        errorCode="403"
        title="Truy cập bị từ chối"
        message="Bạn không có quyền truy cập trang này."
    />;
};

export const Error404 = () => {
    return <HttpErrorPage
        errorCode="404"
        title="Trang không tìm thấy"
        message="Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm."
    />;
};

export const Error500 = () => {
    return <HttpErrorPage
        errorCode="500"
        title="Lỗi hệ thống"
        message="Server có lỗi kỹ thuật. Vui lòng thử lại sau."
    />;
};
