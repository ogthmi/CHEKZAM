import { Button, Modal } from "react-bootstrap";
import { useModal } from "../../hooks/data/useModal";
import { useDeleteButton } from "../../hooks/data/useDeleteButton";

export const ConfirmModalButton = ({ entityType, containerId, itemIdToDelete, variant = "danger", size = "sm", className = "", content = "" }) => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const { handleDelete, message, error, loading } = useDeleteButton(entityType, containerId, itemIdToDelete, closeModal);

    return (
        <>
            <Button variant={variant} size={size} className={className} onClick={openModal}>
                {content}
            </Button>

            <Modal show={isModalOpen} onHide={closeModal} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {content}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Bạn có chắc muốn thực hiện hành động này?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={closeModal} disabled={loading}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? "Đang xóa..." : "Xóa"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
