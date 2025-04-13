import {Col, Container, Row} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { FORM_TYPE } from "../../constants/data";
import { getData } from "../../services/crudService";
import { useEffect, useState } from "react";
import {ActionButton} from "../button/ActionButton";

export const getClassroomId = (pathname) => {
    const classroomIdPosition = 3;
    return pathname.split("/")[classroomIdPosition];
}

export const ClassroomDetailsHeader = () => {
    const location = useLocation();
    const classroomId = getClassroomId(location.pathname);
    const [currentClassroom, setCurrentClassroom] = useState();

    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const fetchedClassroom = await getData(FORM_TYPE.classroom.classroomInfo, classroomId);
                setCurrentClassroom(fetchedClassroom);
            } catch (error) {
                console.error("Error fetching classroom data:", error);
            }
        };
    
        fetchClassroomData();
    }, [location.pathname]);
    
    console.log(currentClassroom);
    

    if (!currentClassroom) {
        return <p>Loading...</p>;
    }

    return (
        <Container>
            <Row className="mt-3 text-lg-start text-center">
                <Col lg={10} className="text-lg-start text-center">
                    <h5 className="fw-1 px-md-0 px-2">{currentClassroom.classroomName}</h5>
                    <p className="text-muted">{currentClassroom.description}</p>
                </Col>
                <Col lg={2} className="justify-content-center">
                    <ActionButton variant="light" content={`Mã lớp: ${currentClassroom.classroomId}`}/>
                </Col>
            </Row>
        </Container>
    );
};