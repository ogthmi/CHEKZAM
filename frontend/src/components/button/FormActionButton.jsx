
import { Button } from "react-bootstrap";
import { DynamicFormModal } from "../modal/DynamicFormModal";
import { useModal } from "../../hooks/data/useModal";
import { useFormActionButton } from "../../hooks/data/useFormActionButton"

export const FormActionButton = ({
    formType, content,
    variant = "primary", size = "", className = "",
    mode, containerId = null, itemId = null, initialData = {}
}) => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const { handleAction, message, error, loading } = useFormActionButton(formType, mode, containerId, itemId, closeModal);

    return (
        <>
            <Button variant={variant} size={size} className={className} onClick={openModal}>{content}</Button>

            {isModalOpen && (
                <DynamicFormModal
                    formType={formType}
                    content={content}
                    onClose={closeModal}
                    mode={mode}
                    initialData={initialData}
                    handleAction={handleAction}
                    loading={loading}
                />
            )}
        </>
    );
};
