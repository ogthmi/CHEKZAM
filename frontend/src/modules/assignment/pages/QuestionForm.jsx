import React from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {CustomerFormTextArea} from "../../../ui/components/form/CommonFormTextArea";
export const QuestionForm = ({ question, questionIndex, assignmentType, onQuestionContentChange, onAnswerContentChange, onAnswerOptionChange, addAnswerOption, removeAnswerOption, removeQuestion }) => {

    return (
        <Card className="mb-3 p-4 rounded-0">
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Câu {questionIndex + 1}:</Form.Label>
                <CustomerFormTextArea
                    placeholder="Nhập nội dung câu hỏi"
                    value={question.questionContent}
                    onChange={(e) => onQuestionContentChange(e, questionIndex)}
                />
            </Form.Group>

            <h6 className="mb-2">Đáp án:</h6>
            <p className={"text-muted"}>Nhấn nút checkbox để chọn đáp án đúng</p>
            {question.answerList.map((answer, answerIndex) => (
                <Row key={answerIndex} className="align-items-center mb-3">
                    <Col xs="auto">
                        <Form.Check
                            type={assignmentType === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                            name={`question-${questionIndex}`} // để radio hoạt động đúng theo từng câu hỏi
                            checked={answer.correct}
                            onChange={() => onAnswerOptionChange(questionIndex, answerIndex)}
                        />
                    </Col>
                    <Col>
                        <CustomerFormTextArea
                            placeholder={`Đáp án ${answerIndex + 1}`}
                            value={answer.answerContent}
                            rows={2}
                            onChange={(e) => onAnswerContentChange(e, questionIndex, answerIndex)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeAnswerOption(questionIndex, answerIndex)}
                        >
                            Xóa đáp án
                        </Button>
                    </Col>
                </Row>
            ))}

            <div className="d-flex justify-content-between">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => addAnswerOption(questionIndex)}
                >
                    + Thêm đáp án
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => removeQuestion(questionIndex)}
                >
                    Xóa câu hỏi
                </Button>
            </div>
        </Card>
    );
};
