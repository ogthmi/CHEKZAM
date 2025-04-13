import { Form } from "react-bootstrap";

export const ClassroomInfoForm = ({ loading, formData, setFormData, handleSubmit }) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Tên lớp học</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.classroomName || ""}
                    onChange={(e) => setFormData({ ...formData, classroomName: e.target.value })}
                    placeholder="Nhập tên lớp học"
                    disabled={loading}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Mô tả lớp học</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả lớp học"
                    disabled={loading}
                />
            </Form.Group>
        </Form>
    );
};
