import React, {useContext} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {AssignmentInfoContext} from "./AssignmentInfoContext";
import {Endpoints} from "../../../../constants/links/Endpoints";
import {UserRoles} from "../../../../constants/data/UserRoles";
import "../../../../css/Button.css"

export const AssignmentInfoHeader = () => {
    const [assignment] = useContext(AssignmentInfoContext);
    if (!assignment) {
        return <p>Đang tải...</p>;
    }
    return (<Container className="p-0 mt-3">
        <Row className={"text-lg-start text-center"}>
            <Col lg={10} className="text-lg-start text-center">
                <Link to={Endpoints.assignment.root(UserRoles.teacher.value.toLowerCase())}
                      className="text-decoration-none text-muted">
                    &laquo; Bài tập
                </Link>
                <h5 className={"px-md-0 px-2 mt-2"}>{assignment.assignmentName || '—'}</h5>
                <p className={"px-md-0 px-2 mt-2 text-muted"}>{assignment.description ? `${assignment.description}` : ""}</p>
                <div className="mb-2 ">
                    <strong>Loại bài tập: </strong>
                    <span>
                        {assignment.assignmentType === 'SINGLE_CHOICE' && 'Trắc nghiệm một đáp án'}
                        {assignment.assignmentType === 'MULTIPLE_CHOICE' && 'Trắc nghiệm nhiều đáp án'}
                        {!assignment.assignmentType && '—'}
                    </span>
                </div>
                <div className={"mb-2"}>
                    <strong>Số câu hỏi: </strong>
                    <span>{assignment.totalQuestions ? `${assignment.totalQuestions} câu` : "—"}</span>
                </div>
                <div className="mb-2">
                    <strong>Thời gian tạo: </strong>
                    <span>{assignment.createdAt ? assignment.createdAt : '-'}</span>
                </div>
            </Col>
            <Col lg={2} className="text-lg-end text-center">
                <Button className="w-100 mb-2">Giao bài tập này</Button>
                <Button variant="light" size="sm" className="w-100">Chỉnh sửa bài tập</Button>
            </Col>


        </Row>

    </Container>)
}