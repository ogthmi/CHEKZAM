import {Container, Row, Col, Button} from "react-bootstrap";

import {CommonSearchInput, CommonSortDropdown} from "../../../ui/components/CommonComponent"
import {UserRoles} from "../../../constants/data/UserRoles";
import {Cookies} from "../../../constants/data/Cookies";

export const ClassroomDocumentPage = () => {
    const isMainRoleTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;
    return (
        <Container>
            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={isMainRoleTeacher ? 8 : 10}><CommonSearchInput/></Col>
                <Col lg={2}><CommonSortDropdown/></Col>
                {isMainRoleTeacher && <Col lg={2}>
                    <Button className={"w-100"}>Thêm tài liệu</Button>
                </Col>}
            </Row>
        </Container>
    );
}