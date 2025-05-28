import React from "react";
import {Form, Card, Row} from "react-bootstrap";
import "../../../../css/Question.css";

export const AnswerNotation = () => {
    return (
        <Row className={"px-0 mb-2"}>
            <h6 className={"p-0 mb-3"}>Quy ước các đáp án</h6>
            <div className={"p-0 d-flex mb-3"}>
                <div className={"d-flex align-items-center me-5"}>
                    <div className={"answer-correct me-3"}
                         style={{width: '50px', height: '25px', border: "solid 1px #35B21F"}}></div>
                    <span>Đáp án đã chọn đúng</span>
                </div>
                <div className={"d-flex align-items-center me-5"}>
                    <div className={"answer-incorrect me-3"}
                         style={{width: '50px', height: '25px', border: "solid 1px #E21F1F"}}></div>
                    <span>Đáp án đã chọn sai</span>
                </div>
                <div className={"d-flex align-items-center"}>
                    <div className={"answer-missed me-3"}
                         style={{width: '50px', height: '25px', border: "solid 1px #E1B33E"}}></div>
                    <span>Đáp án đúng bị bỏ qua</span>
                </div>
            </div>
        </Row>
    );
};

const getAnswerClass = (isDoingAssignment, isSelected, answer) => {
    if (isDoingAssignment) {
        return isSelected ? "answer-selected" : "border border-muted";
    }

    const selected = answer.selectedByStudent;

    if (selected === undefined || selected === null) {
        return answer.correct ? "answer-correct" : "border border-muted";
    }

    if (answer.correct && selected) return "answer-correct";
    if (answer.correct && !selected) return "answer-missed";
    if (!answer.correct && selected) return "answer-incorrect";
    return "border border-muted";
};


export const AssignmentQuestionDisplay = ({
                                              question,
                                              isDoingAssignment = false,
                                              allowMultipleChoice = false,
                                              selectedAnswerIds = [],
                                              onAnswerChange = () => {},
                                              isUnsure = false,
                                              onToggleUnsure = () => {}
                                          }) => {


    const handleClick = (answerId) => {
        if (!isDoingAssignment) return;

        let newSelected = [];

        if (allowMultipleChoice) {
            if (selectedAnswerIds.includes(answerId)) {
                newSelected = selectedAnswerIds.filter(id => id !== answerId);
            } else {
                newSelected = [...selectedAnswerIds, answerId];
            }
        } else {
            if (selectedAnswerIds.includes(answerId)) {
                newSelected = [];
            } else {
                newSelected = [answerId];
            }
        }

        onAnswerChange(newSelected);
    };

    return (
        <div className="px-md-0 px-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="me-4 mb-0"><strong>Câu {question.questionOrder}:</strong></h6>
                {isDoingAssignment && <div className="d-flex align-items-center">
                    <Form.Check
                        type="checkbox"
                        id={`${question.questionId}`}
                        label={`Đánh dấu câu ${question.questionOrder}`}
                        checked={isUnsure}
                        onChange={(e) => onToggleUnsure(question.questionId)}
                        className="mb-0"
                    />
                </div>}
            </div>
            <p>{question.questionContent}</p>
            <div>
                {question.answerList.map((answer) => {
                    const letter = String.fromCharCode(64 + answer.answerOrder); // 1 -> A, 2 -> B...
                    const isSelected = selectedAnswerIds.includes(answer.answerId);

                    return (
                        <Card
                            key={answer.answerId}
                            className={`mb-2 rounded-0 ${getAnswerClass(isDoingAssignment, isSelected, answer)}`}
                            onClick={() => handleClick(answer.answerId)}
                            style={{cursor: isDoingAssignment ? "pointer" : "default"}}
                        >
                            <Card.Body className="py-2 d-flex align-items-center">
                                <strong className="me-2">{letter}.</strong>
                                <span>{answer.answerContent}</span>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
