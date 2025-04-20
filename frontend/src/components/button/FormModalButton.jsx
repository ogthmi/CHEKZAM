import {Button} from "react-bootstrap";
import {FormModal} from "../modal/FormModal";
import {useModal} from "../../hooks/data/useModal";

export const FormModalButton = ({
                                     entityType,
                                     content,
                                     variant = "primary",
                                     size = "",
                                     className = "",
                                     mode,
                                     containerId = null,
                                     itemId = null,
                                     initialData = {}
                                 }) => {
    const {isModalOpen, openModal, closeModal} = useModal();

    return (<>
            <Button variant={variant} size={size} className={className} onClick={openModal}>{content}</Button>
            {isModalOpen && (<FormModal
                    entityType={entityType}
                    content={content}
                    onClose={closeModal}
                    mode={mode}
                    containerId={containerId}
                    itemId={itemId}
                    initialData={initialData}
                />)}
        </>);
};
