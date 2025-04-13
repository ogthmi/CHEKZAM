import { useState } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useModal } from "../../hooks/data/useModal";

export const ActionButton = ({ content, title = "Xác nhận", variant = "primary", size, className = "" }) => {
    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <>
            <Button variant={variant} size={size} className={className} onClick={openModal}>
                {content}
            </Button>

            <Modal show={isModalOpen} onHide={closeModal} centered backdrop="static">
                <Modal.Header closeButton>
                    <h5>{title}</h5>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={closeModal}>Hủy</Button>
                    <Button variant="danger" onClick={closeModal}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};




