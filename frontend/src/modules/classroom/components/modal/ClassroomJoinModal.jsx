import {Modal, Button, Form} from "react-bootstrap";
import {useState} from "react";
import {toast} from "react-toastify";
import {createData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";

export const ClassroomJoinModal = ({onClose, modalTitle = "Tham gia lớp học"}) => {
    const [loading, setLoading] = useState(false);
    const [classroomId, setClassroomId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!classroomId.trim()) {
            toast.warn("Vui lòng nhập mã lớp học.");
            return;
        }

        setLoading(true);
        const response = await createData(EntityTypes.classroom.JOIN, classroomId.trim());
        console.log(response)
        if (response.success) {
            toast.success("Tham gia lớp học thành công!");
            setLoading(false);
            onClose();
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            toast.error("Không thể tham gia lớp học. Mã không hợp lệ hoặc đã tham gia.");
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered backdrop="static">
            <div onClick={(e) => e.stopPropagation()}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã lớp học</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập mã lớp học"
                                value={classroomId}
                                onChange={(e) => setClassroomId(e.target.value)}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Tham gia"}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};
