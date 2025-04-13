import { CustomError } from "../../components/common/CustomErrorPage";

const Error403 = () => {
    return <CustomError
        errorCode="403"
        title="Truy cập bị từ chối"
        message="Bạn không có quyền truy cập trang này."
    />;
};

export default Error403;
