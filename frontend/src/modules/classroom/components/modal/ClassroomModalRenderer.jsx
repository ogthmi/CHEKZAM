import {useContext} from "react";
import {CommonModalContext} from "../../../../ui/components/modal/CommonModalContext";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {DataActions} from "../../../../constants/data/ActionMethods";
import {ClassroomInfoModal} from "./ClassroomInfoModal";
import {ClassroomJoinModal} from "./ClassroomJoinModal";
import {CommonDeleteModal} from "../../../../ui/components/modal/CommonDeleteModal";
import {ClassroomAddStudentModal} from "./ClassroomAddStudentModal";
import {ClassroomAddAssignmentModal} from "./ClassroomAddAssignmentModal";

export const ClassroomModalRenderer = () => {
    const {modalState, closeModal} = useContext(CommonModalContext);
    const {currentModal, modalProps} = modalState;

    if (!currentModal) {
        return
    }

    if (currentModal === EntityTypes.classroom.INFO) {
        const mode = modalProps?.mode || DataActions.CREATE;
        const classroomData = modalProps?.data || null;
        console.log(classroomData)
        return (
            <ClassroomInfoModal
                modalTitle={mode === DataActions.CREATE ? "Tạo lớp học mới" : "Cập nhật lớp học"}
                onClose={closeModal}
                mode={mode}
                itemId={classroomData?.classroomId || null}
                initialData={classroomData}
            />
        );
    }

    if (currentModal === EntityTypes.classroom.JOIN) {
        return (
            <ClassroomJoinModal
                onClose={closeModal}
                modalTitle="Tham gia lớp học"
            />
        );
    }

    if (currentModal === EntityTypes.classroom.LEAVE) {
        const {title, message, itemId, containerId} = modalProps;

        return (
            <CommonDeleteModal
                title={title}
                message={message}
                onClose={closeModal}
                entityType={EntityTypes.classroom.LEAVE}
                itemId={itemId}
                containerId={containerId}
            />
        );
    }

    if (currentModal === EntityTypes.classroom.DELETE) {
        const {title, message, itemId, entityType, containerId} = modalProps;

        return (
            <CommonDeleteModal
                title={title}
                message={message}
                onClose={closeModal}
                entityType={entityType}
                itemId={itemId}
                containerId={containerId}
            />
        );
    }

    if (currentModal === EntityTypes.classroom.ADD_STUDENT) {
        const {containerId} = modalProps;
        console.log(modalProps)
        return (
            <ClassroomAddStudentModal containerId={containerId} onClose={closeModal}/>
        )
    }

    if (currentModal === EntityTypes.classroom.REMOVE_STUDENT) {
        const {title, message, classroomId, studentId} = modalProps;
        return <CommonDeleteModal
            title={title}
            message={message}
            onClose={closeModal}
            entityType={EntityTypes.classroom.JOIN}
            containerId={classroomId}
            itemId={studentId}
        />
    }

    if (currentModal === EntityTypes.classroom.ADD_ASSIGNMENT) {
        const {containerId} = modalProps;
        console.log(modalProps)
        return (
            <ClassroomAddAssignmentModal containerId={containerId} onClose={closeModal}/>
        )
    }

    if (currentModal === EntityTypes.classroom.REMOVE_ASSIGNMENT) {
        const {title, message, classroomId, assignmentId} = modalProps;
        return <CommonDeleteModal
            title={title}
            message={message}
            onClose={closeModal}
            entityType={EntityTypes.classroom.ADD_ASSIGNMENT}
            containerId={classroomId}
            itemId={assignmentId}
        />
    }

    return null;
};
