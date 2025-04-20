import { Button, Modal } from "react-bootstrap";
import { useModal } from "../../hooks/data/useModal";

export const ActionButton = ({
    buttonContent,
    variant = "primary",
    size,
    className = "",
    modalTitle = "Xác nhận",
    modalBody = ""
}) => {
    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <>
            <Button variant={variant} size={size} className={className} onClick={openModal}>
                {buttonContent}
            </Button>

            <Modal show={isModalOpen} onHide={closeModal} size="lg" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="fs-5 fw-normal text-muted">
                        Giáo viên có thể chia sẽ mã lớp này cho sinh viên tham gia
                    </p>
                    <p
                        className="fw-semibold text-primary"
                        style = {{fontSize: "clamp(3rem, 6vw, 9rem)"}}
                    >
                        {modalBody}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};




