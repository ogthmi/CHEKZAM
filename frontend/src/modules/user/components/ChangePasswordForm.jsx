import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ChangePasswordForm = ({ onCancel, onSave, className="" }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.oldPassword === formData.newPassword) {
            toast.error('Mật khẩu mới trùng mật khẩu cũ!');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu mới không khớp!');
            return;
        }
        onSave(formData);
    };

    return (
        <Form onSubmit={handleSubmit} className={className}>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>
                    Mật khẩu hiện tại
                </Form.Label>
                <Col sm={8}>
                    <Form.Control
                        type="password"
                        name="oldPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>
                    Mật khẩu mới
                </Form.Label>
                <Col sm={8}>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4}>
                    Xác nhận mật khẩu mới
                </Form.Label>
                <Col sm={8}>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        required
                    />
                </Col>
            </Form.Group>
            <div className="text-md-end text-center">
                <Button variant="light" size={"sm"} onClick={onCancel} className={"me-2"}>
                    Hủy
                </Button>
                <Button variant="primary" size={"sm"} type="submit">
                    Cập nhật
                </Button>
            </div>
        </Form>
    );
};

export default ChangePasswordForm;
