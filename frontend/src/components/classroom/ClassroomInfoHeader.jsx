import {Col, Container, Row} from "react-bootstrap";
import {useContext} from "react";
import {ActionButton} from "../button/ActionButton"
import {ClassroomInfoContext} from "../context/ClassroomInfoContext";

export const ClassroomInfoHeader = () => {
    const [currentClassroom, setCurrentClassroom] = useContext(ClassroomInfoContext);

    if (!currentClassroom) {
        return <p>Đang tải...</p>;
    }

    return (
        <Container>
            <Row className="mt-3 text-lg-start text-center">
                <Col lg={9} className="text-lg-start text-center">
                    <h5 className="fw-1 px-md-0 px-2">{currentClassroom.classroomName}</h5>
                    <p className="text-muted">{currentClassroom.description}</p>
                </Col>
                <Col lg={3} className="text-lg-end text-center">
                    <ActionButton
                        buttonContent={`Mã lớp: ${currentClassroom.classroomId}`}
                        variant="light"
                        title="Mã lớp"
                        modalTitle="Mã lớp học"
                        modalBody={currentClassroom.classroomId}
                    />
                </Col>
            </Row>
        </Container>
    );
};