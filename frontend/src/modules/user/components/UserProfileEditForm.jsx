import React from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {convertDateToInputFormat} from "../util/UserDataFormatter";

export const UserProfileEditForm = ({editedUser, onChange, onSave, onCancel}) => {
    return (
        <Card.Body>
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="lastName">
                    <Form.Label column sm={3}>Họ và tên đệm:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={editedUser.lastName || ''}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="firstName">
                    <Form.Label column sm={3}>Tên:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={editedUser.firstName || ''}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="gender">
                    <Form.Label column sm={3}>Giới tính:</Form.Label>
                    <Col sm={9}>
                        <Form.Check
                            inline
                            type="radio"
                            label="Nam"
                            name="gender"
                            value="MALE"
                            checked={editedUser.gender === 'MALE'}
                            onChange={onChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Nữ"
                            name="gender"
                            value="FEMALE"
                            checked={editedUser.gender === 'FEMALE'}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="birthdate">
                    <Form.Label column sm={3}>Ngày sinh:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="date"
                            name="birthdate"
                            value={convertDateToInputFormat(editedUser.birthdate)}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Form.Label column sm={3}>Email:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="email"
                            name="email"
                            value={editedUser.email || ''}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="school">
                    <Form.Label column sm={3}>Trường:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="school"
                            value={editedUser.school || ''}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="department">
                    <Form.Label column sm={3}>Khoa/Lớp:</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="text"
                            name="department"
                            value={editedUser.department || ''}
                            onChange={onChange}
                        />
                    </Col>
                </Form.Group>

                <Row className="text-md-end text-center">
                    <Col sm={{ span: 9, offset: 3 }}>
                        <Button variant="light" size="sm" className="me-2" onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button size="sm" onClick={onSave}>
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card.Body>
    );
};
