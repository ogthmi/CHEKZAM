import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from 'react';
import { useSignIn } from '../../hooks/auth/useSignin';
import { Endpoints } from '../../constants/links/Endpoints';

export function SignInForm() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const handleSignIn = useSignIn(formData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSignIn(formData);
    };


    return (
        <Container>
            <h3 className="text-center mb-4 pt-5">Đăng nhập</h3>
            <Row className="justify-content-center">
                <Col md={6} lg={5} className="p-5 pt-0">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Tên đăng nhập:</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Mật khẩu:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="mb-3 text-end">
                            <Link to={Endpoints.auth.forgotPassword} className="text-primary">Quên mật khẩu?</Link>
                        </div>
                        <div className="text-center mb-3">
                            <Button type="submit" className="w-100 btn-primary">Đăng nhập</Button>
                            <p className="pt-3">Hoặc</p>
                            <Button variant="light" className="w-100">Đăng nhập với Google</Button>
                        </div>
                        <div className="text-center mb-3">
                            <p className='me-2'>
                                Chưa có tài khoản?
                                <Link to={Endpoints.auth.signup} className="text-primary ms-2">Đăng ký</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
