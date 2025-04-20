import {Link} from "react-router-dom";

import {Container, Row, Col, Form, Button} from "react-bootstrap";

import {useSignUp} from "../../hooks/auth/useSignup";

import {Endpoints} from "../../constants/links/Endpoints";

export function SignUpForm() {
    const {formData, handleChange, handleSignUp, error, message} = useSignUp();

    return (
        <Container className="justify-content-center mt-5">
            <h3 className="text-center mb-4">Đăng ký</h3>
            <Row className="justify-content-center">
                <Col md={8} lg={6} className="px-5">
                    <Form onSubmit={handleSignUp}>
                        <Row>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Tên đăng nhập:</Form.Label>
                                <Form.Control type="text" name="username" value={formData.username}
                                              onChange={handleChange}/>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Mật khẩu:</Form.Label>
                                <Form.Control type="password" name="password" value={formData.password}
                                              onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col lg={6} className="mb-2">
                                <Form.Label>Họ và tên:</Form.Label>
                                <Form.Control type="text" name="fullName" value={formData.fullName}
                                              onChange={handleChange}/>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Ngày sinh:</Form.Label>
                                <Form.Control type="date" name="birthdate" value={formData.birthdate}
                                              onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row className="mb-1">
                            <Col>
                                <Form.Label className="me-3">Giới tính:</Form.Label>
                                <Form.Check inline label="Nam" type="radio" name="gender" value="male"
                                            checked={formData.gender === "male".toUpperCase()} onChange={handleChange}/>
                                <Form.Check inline label="Nữ" type="radio" name="gender" value="female"
                                            checked={formData.gender === "female".toUpperCase()}
                                            onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mb-2">
                                <Form.Label className="me-3">Chức vụ:</Form.Label>
                                <Form.Check inline label="Giáo viên" type="radio" name="role" value="teacher"
                                            checked={formData.role === "teacher".toUpperCase()}
                                            onChange={handleChange}/>
                                <Form.Check inline label="Sinh viên" type="radio" name="role" value="student"
                                            checked={formData.role === "student".toUpperCase()}
                                            onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Trường:</Form.Label>
                                <Form.Control type="text" name="school" value={formData.school}
                                              onChange={handleChange}/>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Lớp/Khoa:</Form.Label>
                                <Form.Control type="text" name="department" value={formData.department}
                                              onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mb-2">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="text-center mb-2">
                                <Button type="submit" className="w-100" variant="primary">Đăng ký</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Row>
                        <Col className="py-2 text-center">
                            <p>Đã có tài khoản? <Link to={Endpoints.auth.signin} className="text-primary">Đăng
                                nhập</Link></p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
