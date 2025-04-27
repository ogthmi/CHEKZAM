import { Container, Row, Col } from "react-bootstrap";
import { LinkButton } from "../../components/button/LinkButton"
import {DefaultRoleBaseRoutes} from "../../router/core/RoleBasedRoutes";
import {Cookies} from "../../constants/data/Cookies";

export const HttpErrorPage = ({ errorCode, title, message }) => {
    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row className="text-center">
                <Row className="justify-content-center">
                    <Col md={6} xs={12}>
                        <img src="/assets/CHEKZAM-logo.png" alt="Classroom" className="w-75" />
                    </Col>
                </Row>

                <Row className="d-block">
                    <Col className="mb-4">
                        <h1 style={{ fontSize: "8rem" }} className="fw-bold text-primary">{errorCode}</h1>
                    </Col>

                    <Col className="mb-5">
                        <h2 className="fs-md-1 fs-2 fw-bold">{title}</h2>
                        <p className="text-secondary px-3">{message}</p>
                    </Col>

                    <Col>
                        <div className="justify-content-center">
                            <LinkButton
                                href={DefaultRoleBaseRoutes(Cookies.getCookie(Cookies.mainRole))}
                                content="Về trang chủ"
                            />
                        </div>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
};