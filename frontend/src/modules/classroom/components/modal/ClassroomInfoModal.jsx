import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createData, updateData } from "../../../../services/CRUDService";
import { DataActions } from "../../../../constants/data/ActionMethods";
import { EntityTypes } from "../../../../constants/data/EntityTypes";

export const ClassroomInfoModal = ({ modalTitle, onClose, mode, itemId, initialData = {} }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(mode === DataActions.CREATE ? {} : initialData);

    useEffect(() => {
        if (mode === DataActions.UPDATE) {
            setFormData(initialData || {});
        }
    }, [initialData, mode]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (loading) return; // Không làm gì nếu đang xử lý

        setLoading(true);
        console.log(itemId)
        let message;
        try {
            if (mode === DataActions.CREATE) {
                // Gửi yêu cầu tạo mới lớp học
                message = await createData(EntityTypes.classroom.INFO, null, itemId, formData);
            } else if (mode === DataActions.UPDATE) {
                message = await updateData(EntityTypes.classroom.INFO, null, itemId, formData);
            }

            if (message) {
                toast.success(`${mode === DataActions.CREATE ? "Thêm mới" : "Cập nhật"} lớp học thành công!`);
                onClose();
                setTimeout(() => {window.location.reload()}, 3000)
            } else {
                toast.error("Có lỗi xảy ra khi xử lý!");
            }
        } catch (error) {
            toast.error("Lỗi khi kết nối với máy chủ!");
        } finally {
            setLoading(false); // Set loading thành false sau khi hoàn tất
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered backdrop="static">
            <div onClick={(event) => event.stopPropagation()}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle || (mode === DataActions.CREATE ? "Tạo lớp học" : "Chỉnh sửa lớp học")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        {/* Tên lớp học */}
                        <Form.Group className="mb-3">
                            <Form.Label>Tên lớp học</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.classroomName || ""}
                                onChange={(e) => setFormData({ ...formData, classroomName: e.target.value })}
                                placeholder="Nhập tên lớp học"
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        {/* Mô tả lớp học */}
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả lớp học</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Nhập mô tả lớp học"
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" onClick={handleFormSubmit} disabled={loading}>
                        {loading ? "Đang xử lý..." : (mode === DataActions.UPDATE ? "Lưu thay đổi" : "Tạo lớp học")}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};
