import { Button, Modal } from "react-bootstrap";

export const ClassroomIdModal = ({ show, onClose, classroomId, title  = "Chia sẻ mã lớp học" }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p className="fs-5 fw-normal text-muted">
                    Chia sẻ mã lớp cho thành viên khác
                </p>
                <p
                    className="fw-semibold text-primary"
                    style={{
                        fontSize: "clamp(3rem, 6vw, 9rem)",  // Điều chỉnh kích thước động
                        wordWrap: "break-word",            // Đảm bảo không bị tràn dòng
                        whiteSpace: "normal",              // Cho phép text bẻ dòng khi cần thiết
                        overflowWrap: "break-word"         // Đảm bảo ngắt từ khi cần
                    }}
                >
                    {classroomId}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};
