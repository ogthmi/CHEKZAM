import React from "react";
import { Col, Form, Row } from "react-bootstrap";

export const AssignmentInfoEditForm = ({ formData, handleChange, isInClassroom }) => {
    return (
        <Form className="text-start"> {/* đảm bảo không bị text-center ở Form */}
            <Row>
                <Col lg={6}>
                    <Row className="my-3">
                        <Col>
                            <div>Tên bài tập</div>
                            <Form.Control
                                type="text"
                                name="assignmentName"
                                value={formData.assignmentName}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Row className="my-3">
                        <Col>
                            <div>Loại bài tập</div>
                            <Form.Select
                                name="assignmentType"
                                value={formData.assignmentType}
                                onChange={handleChange}
                            >
                                <option value="">—</option>
                                <option value="SINGLE_CHOICE">Trắc nghiệm một đáp án</option>
                                <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="my-3">
                        <Col>
                            <div>Mô tả</div>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    {isInClassroom && (
                        <>
                            <Row className="my-3 align-items-center">
                                <Col xs="auto">
                                    <span>Đảo đề tự động</span>
                                </Col>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Bật"
                                        name="shuffleEnabled"
                                        checked={formData.shuffleEnabled}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>

                        </>
                    )}
                </Col>

                <Col lg={6}>
                    {isInClassroom && (
                        <>
                            <Row className="my-3">
                                <Col>
                                    <div>Thời lượng làm bài</div>
                                    <Form.Control
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>

                            <Row className="my-3">
                                <Col>
                                    <div>Số lượt làm bài tối đa</div>
                                    <Form.Control
                                        type="number"
                                        name="maxAttempts"
                                        value={formData.maxAttempts}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>

                            <Row className="my-3">
                                <Col>
                                    <div>Thời gian mở bài</div>
                                    <Form.Control
                                        type="datetime-local"
                                        name="openTime"
                                        value={formData.openTime}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>

                            <Row className="my-3">
                                <Col>
                                    <div>Hạn chót</div>
                                    <Form.Control
                                        type="datetime-local"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Col>
            </Row>
        </Form>
    );
};
