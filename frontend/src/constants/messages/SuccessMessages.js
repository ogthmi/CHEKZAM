import {DataActions} from "../data/ActionMethods";
import {EntityTypes} from "../data/EntityTypes";

const SuccessMessages = {
    [EntityTypes.classroom.INFO]: {
        [DataActions.CREATE]: "Đã tạo lớp học thành công!",
        [DataActions.UPDATE]: "Thông tin lớp học đã được cập nhật.",
        [DataActions.DELETE]: "Lớp học đã được xóa.",
    },
    [EntityTypes.classroom.ADD_STUDENT]: {
        [DataActions.APPEND]: "Thêm sinh viên vào lớp thành công!",
        [DataActions.DELETE]: "Thành viên đã được xóa khỏi lớp.",
    },
    [EntityTypes.classroom.JOIN]: {
        [DataActions.CREATE]: "Bạn đã tham gia lớp học.",
    },
    [EntityTypes.classroom.LEAVE]: {
        [DataActions.DELETE]: "Bạn đã rời khỏi lớp học.",
    },
};

export const getSuccessMessage = (entityType, actionType) => {
    return SuccessMessages?.[entityType]?.[actionType] || "Thao tác thành công!";
};
