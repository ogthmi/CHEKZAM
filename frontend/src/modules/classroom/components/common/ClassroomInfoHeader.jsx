import {Button, Col, Container, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {ClassroomInfoContext} from "./ClassroomInfoContext";
import {useModal} from "../../../../ui/hooks/data/useModal";
import {ClassroomIdModal} from "../modal/ClassroomIdModal";
import {Endpoints} from "../../../../constants/links/Endpoints";
import {UserRoles} from "../../../../constants/data/UserRoles";
import {Link} from "react-router-dom";

export const ClassroomInfoHeader = () => {
    const [currentClassroom] = useContext(ClassroomInfoContext);
    const {isModalOpen, openModal, closeModal} = useModal();

    if (!currentClassroom) {
        return <p>Đang tải...</p>;
    }

    return (
        <Container className={"p-0"}>
            <Row className="mt-3 text-lg-start text-center">
                <Col lg={9} className="text-lg-start text-center">
                    <Link
                        to={Endpoints.classroom.root(UserRoles.teacher.value.toLowerCase())}
                        className="text-decoration-none text-muted"
                    >
                        &laquo; Lớp học
                    </Link>
                    <h5 className="fw-1 px-md-0 px-2 mt-2">{currentClassroom.classroomName.toUpperCase()}</h5>
                    <p className="text-muted">{currentClassroom.description}</p>
                </Col>
                <Col lg={3} className="text-lg-end text-center">
                    <Button
                        variant={"light"}
                        size={"sm"}
                        onClick={openModal}
                    >
                        Chia sẻ mã lớp
                    </Button>
                </Col>
            </Row>

            <ClassroomIdModal
                show={isModalOpen}
                onClose={closeModal}
                classroomId={currentClassroom.classroomId}
            />
        </Container>
    );
};
