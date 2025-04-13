import { CustomError } from "../../components/common/CustomErrorPage";

const Error500 = () => {
    return <CustomError
        errorCode="500"
        title="Lỗi hệ thống"
        message="Server có lỗi kỹ thuật. Vui lòng thử lại sau."
    />;
};

export default Error500;
