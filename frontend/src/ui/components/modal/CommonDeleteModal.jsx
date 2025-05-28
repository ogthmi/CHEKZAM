import { Modal, Button } from "react-bootstrap";
import { useDeleteHandler } from "../../hooks/data/useDeleteHandler";

export const CommonDeleteModal = ({
                                      title,
                                      message,
                                      onClose,
                                      entityType,
                                      containerId = null,
                                      itemId,
                                      onSuccess,
                                      onError,
                                  }) => {
    const { handleDelete } = useDeleteHandler();

    const handleConfirm = async () => {
        await handleDelete({
            entityType,
            containerId,
            itemId,
            onSuccess: (res) => {
                onSuccess?.(res);
                onClose();
            },
            onError: (err) => {
                onError?.(err);
            }
        });
    };

    return (
        <Modal show={true} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{lineHeight: '2'}}>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="border border-none" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

