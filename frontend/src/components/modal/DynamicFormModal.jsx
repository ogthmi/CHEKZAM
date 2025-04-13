import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { DATA_ACTIONS, FORM_TYPE } from "../../constants/data";
import { Modal } from "react-bootstrap";

import { ClassroomInfoForm } from "../form/ClassroomInfoForm";

export const DynamicFormModal = ({ formType, content, onClose, loading,
    mode, handleAction, initialData = {}
}) => {
    const [formData, setFormData] = useState(mode === DATA_ACTIONS.create ? {} : initialData);

    useEffect(() => {
        if (mode === DATA_ACTIONS.update) {
            setFormData(initialData || {});
        }
    }, [initialData, mode]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleAction(formData);
    };

    const renderForm = () => {
        switch (formType) {
            case FORM_TYPE.classroom.classroomInfo:
                return (
                    <ClassroomInfoForm
                        loading={loading}
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleFormSubmit}
                    />
                );
            default:
                return <p>Không có form phù hợp</p>;
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered backdrop="static">
            <div onClick={(event) => event.stopPropagation()}>
                <Modal.Header closeButton>
                    <Modal.Title>{content || "Biểu mẫu"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderForm()}</Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleFormSubmit} disabled={loading}>
                        {loading ? "Đang xử lý..." : (mode === DATA_ACTIONS.update ? "Lưu thay đổi" : "Tiếp tục")}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>

    );
};