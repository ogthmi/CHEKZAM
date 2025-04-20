import {UserRoles} from "../../constants/data/UserRoles";
import {DataActions} from "../../constants/data/ActionMethods";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {FormModalButton} from "../button/FormModalButton";
import {ConfirmModalButton} from "../button/ConfirmModalButton";


export const ClassroomRowRenderActions = ({mainRole, row}) => {
    const renderActions = () => {
        if (mainRole === UserRoles.TEACHER.value) {
            return (
                <>
                    <FormModalButton
                        entityType={EntityTypes.classroom.INFO}
                        content="Chỉnh sửa lớp"
                        size="sm"
                        className="me-lg-2 me-0 mb-lg-0 mb-2"
                        mode={DataActions.UPDATE}
                        itemId={row.classroomId}
                        initialData={row}
                    />
                    <ConfirmModalButton
                        entityType={EntityTypes.classroom.INFO}
                        itemIdToDelete={row.classroomId}
                        content="Xóa lớp"
                        className=""
                    />
                </>
            );
        } else if (mainRole === UserRoles.STUDENT.value) {
            return <ConfirmModalButton object={EntityTypes.classroom.INFO} itemIdToDelete={row.studentId}
                                       content="Rời khỏi lớp"/>
        } else return null;
    }
    return renderActions();
};

export const ClassroomRenderAction = ({mainRole}) => {
    const renderAction = () => {
        if (mainRole === UserRoles.TEACHER.value) {
            return <FormModalButton
                entityType={EntityTypes.classroom.INFO}
                content="Tạo lớp học"
                className="w-100"
                mode={DataActions.CREATE}
            />
        } else if (mainRole === UserRoles.STUDENT.value) {
            return <FormModalButton content="Tham gia lớp" className="w-100"/>;
        } else return null;
    }
    return renderAction();
};
