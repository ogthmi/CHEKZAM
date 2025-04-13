import React from "react";
import { ROLES } from "../../constants/roles";
import { FormActionButton } from "../button/FormActionButton";
import { DeleteButton } from "../button/DeleteButton";
import { DATA_ACTIONS, FORM_TYPE } from "../../constants/data";

export const ClassroomRowRenderActions = ({ mainRole, row }) => {
    const renderActions = () => {
        if (mainRole === ROLES.teacher.name) {
            return (
                <>
                    <FormActionButton
                        formType={FORM_TYPE.classroom.classroomInfo}
                        content="Chỉnh sửa lớp"
                        size="sm"
                        className="me-lg-2 me-0 mb-lg-0 mb-2"
                        mode={DATA_ACTIONS.update}
                        itemId={row.classroomId}
                        initialData={row}
                    />
                    <DeleteButton
                        formType={FORM_TYPE.classroom.classroomInfo}
                        itemIdToDelete={row.classroomId}
                        content="Xóa lớp"
                        className=""
                    />
                </>
            );
        }
        else if (mainRole === ROLES.student.name) {
            return <DeleteButton object={FORM_TYPE.classroom.classroomInfo} itemIdToDelete={row.studentId} content="Rời khỏi lớp" />
        }
        else return null;
    }
    return renderActions();
};

export const ClassroomRenderAction = ({ mainRole }) => {
    const renderAction = () => {
        if (mainRole === ROLES.teacher.name) {
            return <FormActionButton
                formType={FORM_TYPE.classroom.classroomInfo}
                content="Tạo lớp học"
                className="w-100"
                mode={DATA_ACTIONS.create}
            />
        }
        else if (mainRole === ROLES.student.name) {
            return <FormActionButton content="Tham gia lớp" className="w-100" />;
        }
        else return null;
    }
    return renderAction();
};
