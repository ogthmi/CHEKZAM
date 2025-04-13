import { Container, Form, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SUB_ENDPOINTS } from "../../constants/endPoints";

export const ForgotPassWordForm = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center mt-5 px-5">
            <Col md={6} lg={4}>
                <h3 className="mb-4 text-center">Quên mật khẩu</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Nhập email khôi phục</Form.Label>
                        <Form.Control type="email" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Gửi yêu cầu
                    </Button>
                </Form>
                <Link to={SUB_ENDPOINTS.auth.signin} className="text-decoration-none text-primary"><p className="text-center">Quay lại đăng nhập</p></Link>
                <p className="mt-3 text-muted text-center" style={{ fontSize: "14px" }}>
                    Sau khi bấm gửi yêu cầu, vui lòng kiểm tra lại email để nhận mật khẩu khôi phục.
                </p>
            </Col>
        </Container>
    );
}