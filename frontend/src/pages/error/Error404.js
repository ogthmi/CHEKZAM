import { CustomError } from "../../components/common/CustomErrorPage";

const Error404 = () => {
    return <CustomError
        errorCode="404"
        title="Trang không tìm thấy"
        message="Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm."
    />;
};

export default Error404;
