import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "../../../../css/Question.css"

export const AssignmentQuestionDisplay = ({ question }) => {
    return (
        <div className="px-0 mb-4">
            <h6><strong>Câu {question.questionOrder}:</strong></h6>
            <p>{question.questionContent}</p>
            <div>
                {question.answerList.map((answer) => {
                    const letter = String.fromCharCode(64 + answer.answerOrder); // 1 -> A, 2 -> B...
                    return (
                        <Card
                            key={answer.answerId}
                            className={`mb-2 rounded-0 ${answer.correct ? "answer-correct" : "border border-muted"}`}
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
