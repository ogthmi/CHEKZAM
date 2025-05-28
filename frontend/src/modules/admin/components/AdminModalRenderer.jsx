import {useContext} from "react";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {CommonDeleteModal} from "../../../ui/components/modal/CommonDeleteModal";
import {CreateUserModal} from "../modal/CreateUserModal";

export const AdminModalRenderer = () => {
    const {modalState, closeModal} = useContext(CommonModalContext);
    const {currentModal, modalProps} = modalState;

    if (!currentModal) {
        return
    }

    if (currentModal === EntityTypes.user.DELETE) {
        const {title, message, itemId} = modalProps;
        console.log(modalProps)
        return <CommonDeleteModal
            title={title}
            message={message}
            onClose={closeModal}
            entityType={EntityTypes.user.PROFILE}
            containerId={null}
            itemId={itemId}
        />
    }

    if (currentModal === EntityTypes.user.CREATE) {
        return <CreateUserModal onClose={closeModal} />
    }
}