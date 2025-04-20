import {Button, Modal} from "react-bootstrap";
import {useState, useEffect} from "react";

import {DataActions} from "../../constants/data/ActionMethods";
import {EntityTypes} from "../../constants/data/EntityTypes";

import {ClassroomInfoForm} from "../form/ClassroomInfoForm";
import {useFormActionButton} from "../../hooks/data/useFormActionButton";

const renderForm = (entityType, formData, setFormData, handleSubmit, loading) => {
    switch (entityType) {
        case EntityTypes.classroom.INFO:
            return (
                <ClassroomInfoForm
                    loading={loading}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />
            );
        default:
            return <p>Không có biểu mẫu phù hợp</p>;
    }
};

export const FormModal = ({
                                     entityType,
                                     content,
                                     onClose,
                                     mode,
                                     containerId,
                                     itemId,
                                     initialData = {},
                                 }) => {
    const {handleAction, loading} = useFormActionButton(entityType, mode, containerId, itemId, onClose);
    const [formData, setFormData] = useState(mode === DataActions.CREATE ? {} : initialData);

    useEffect(() => {
        if (mode === DataActions.UPDATE) {
            setFormData(initialData || {});
        }
    }, [initialData, mode]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleAction(formData);
    };

    return (
        <Modal show={true} onHide={onClose} centered backdrop="static">
            <div onClick={(event) => event.stopPropagation()}>
                <Modal.Header closeButton>
                    <Modal.Title>{content || "Biểu mẫu"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderForm(entityType, formData, setFormData, handleFormSubmit, loading)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleFormSubmit} disabled={loading}>
                        {loading ? "Đang xử lý..." : (mode === DataActions.UPDATE ? "Lưu thay đổi" : "Tiếp tục")}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};
