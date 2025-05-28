import {useContext} from "react";
import {CommonModalContext} from "../../../../ui/components/modal/CommonModalContext";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {DataActions} from "../../../../constants/data/ActionMethods";
import {ClassroomInfoModal} from "../../../classroom/components/modal/ClassroomInfoModal";
import {ClassroomJoinModal} from "../../../classroom/components/modal/ClassroomJoinModal";
import {CommonDeleteModal} from "../../../../ui/components/modal/CommonDeleteModal";
import {ClassroomAddStudentModal} from "../../../classroom/components/modal/ClassroomAddStudentModal";
import {ClassroomAddAssignmentModal} from "../../../classroom/components/modal/ClassroomAddAssignmentModal";

export const AssignmentModalRenderer = () => {
    const {modalState, closeModal} = useContext(CommonModalContext);
    const {currentModal, modalProps} = modalState;

    if (!currentModal) {
        return
    }

    if (currentModal === EntityTypes.assignment.DELETE) {
        const {title, message, itemId} = modalProps;
        console.log(modalProps)
        return <CommonDeleteModal
            title={title}
            message={message}
            onClose={closeModal}
            entityType={EntityTypes.assignment.INFO}
            containerId={null}
            itemId={itemId}
        />
    }

    return null;
};