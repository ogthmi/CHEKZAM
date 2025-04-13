import { LinkButton } from "../button/LinkButton"
import { Container, Row, Col } from "react-bootstrap";
import { SUB_ENDPOINTS } from "../../constants/endPoints";

export function Header() {
    return (
        <header id='#landing' className="py-5">
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} className="text-lg-start text-center">
                        <div>
                            <img src="/assets/CHEKZAM-logo.png" alt="Classroom" className="img-fluid" />
                            <h3 className="px-4 pb-4 px-lg-0">Quản lý lớp học trực tuyến đơn giản và hiệu quả</h3>
                        </div>
                        <div>
                            <LinkButton href="#features" variant="light" className="me-2" content="Tìm hiểu thêm"/>
                            <LinkButton href={SUB_ENDPOINTS.auth.signup} content="Đăng ký ngay"/>
                        </div>
                    </Col>
                    <Col lg={6} className="py-5 text-lg-end text-center">
                        <img src="/assets/4055619.jpg" alt="Classroom Illustration" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </header>
    );
}