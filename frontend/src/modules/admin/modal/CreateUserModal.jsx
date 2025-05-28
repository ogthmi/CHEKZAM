import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {useState} from "react";
import {createData} from "../../../services/CRUDService";
import {toast} from "react-toastify";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import moment from "moment";

export const CreateUserModal = ({onClose}) => {
    const [isAdminRoleSelected, setIsAdminRoleSelected] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
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
        if (name === "role") {
            if (value === 'admin') setIsAdminRoleSelected(false);
            else setIsAdminRoleSelected(true);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const payload = {
            ...formData,
            birthdate: moment(formData.birthdate).format("DD-MM-YYYY"),
        }
        const response = await createData(EntityTypes.user.CREATE, null, null, payload);
        if (response.success) {
            toast.success("Tạo người dùng mới thành công")
            onClose();
            setTimeout(() => {window.location.reload()}, 3000);
        }
        setIsLoading(false);
    }
    return (
        <Modal centered backdrop={"static"} size={"lg"} show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tạo người dùng mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                            <Form.Control type="text" name="firstName" value={formData.fullName}
                                          placeholder={"Nhập tên"}
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
                                        onChange={handleChange}
                            />
                            <Form.Check inline label="Sinh viên" type="radio" name="role" value="student"
                                        checked={formData.role === "student".toUpperCase()}
                                        onChange={handleChange}
                            />
                            <Form.Check inline label="Quản trị" type="radio" name="role" value="admin"
                                        checked={formData.role === "admin".toUpperCase()}
                                        onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    {isAdminRoleSelected &&
                        <Row>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Trường:</Form.Label>
                                <Form.Control type="text" name="school" value={formData.school}
                                              placeholder={"Nhập tên trường học"}
                                              onChange={handleChange}/>
                            </Col>
                            <Col lg={6} className="mb-2">
                                <Form.Label>Lớp/Khoa:</Form.Label>
                                <Form.Control type="text" name="department" value={formData.department}
                                              placeholder={"Nhập tên lớp hoặc khoa"}
                                              onChange={handleChange}/>
                            </Col>
                        </Row>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"light"} onClick={onClose}>Hủy</Button>
                <Button type={"submit"} onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Đang xử lý ..." : "Tạo người dùng"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}