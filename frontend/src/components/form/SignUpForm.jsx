import {Link} from "react-router-dom";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import {useSignUp} from "../../hooks/auth/useSignup";
import {Endpoints} from "../../constants/links/Endpoints";
import React, {useState} from "react";
import ReactDatetime from "react-datetime";

export function SignUpForm(hasAdminRole) {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        lastName: "",
        firstName: "",
        birthdate: "",
        gender: "",
        role: "",
        school: "",
        department: "",
        email: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "gender" || name === "role" ? value.toUpperCase() : value
        }));
    };

    const handleSignUp = useSignUp(formData);

    return (<Container className="justify-content-center mt-5">
        <h3 className="text-center mb-4">Đăng ký</h3>
        <Row className="justify-content-center">
            <Col md={8} lg={6} className="px-5">
                <Form onSubmit={handleSignUp}>
                    <Row>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Tên tài khoản:</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                placeholder={"Nhập tên tài khoản"}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Mật khẩu:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder={"Nhập mật khẩu"}
                                onChange={handleChange}/>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col lg={6} className="mb-2">
                            <Form.Label>Họ đệm:</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.fullName}
                                placeholder={"Nhập họ đệm"}
                                onChange={handleChange}/>
                        </Col>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Tên:</Form.Label>
                            <Form.Control type="text" name="firstName" value={formData.fullName} placeholder={"Nhập tên"}
                                          onChange={handleChange}/>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col lg={6} className="mb-2">
                            <Form.Label>Ngày sinh:</Form.Label>
                            <Form.Control
                                type="date"
                                className="form-control"
                                value={formData.birthdate ? formData.birthdate.split('T')[0] : ''}  // ISO string → yyyy-mm-dd
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        birthdate: e.target.value ? new Date(e.target.value).toISOString() : null,  // Lưu ISO string
                                    })
                                }
                            />

                        </Col>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email"
                                          name="email"
                                          placeholder={"Nhập địa chỉ email"}
                                          value={formData.email}
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
                            {hasAdminRole === true ?
                                <Form.Check inline label="Quản trị" type="radio" name="role" value="admin"
                                            checked={formData.role === "admin".toUpperCase()}
                                            onChange={handleChange}/> : null}
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Trường:</Form.Label>
                            <Form.Control type="text" name="school" value={formData.school} placeholder={"Nhập tên trường học"}
                                          onChange={handleChange}/>
                        </Col>
                        <Col lg={6} className="mb-2">
                            <Form.Label>Lớp/Khoa:</Form.Label>
                            <Form.Control type="text" name="department" value={formData.department} placeholder={"Nhập tên lớp hoặc khoa"}
                                          onChange={handleChange}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={2}/>
                        <Col lg={8} className="text-center mt-3 mb-2">
                            <Button type="submit" className="w-100" variant="primary">Đăng ký</Button>
                        </Col>
                        <Col lg={2}/>
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
    </Container>);
}
