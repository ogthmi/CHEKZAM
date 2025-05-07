import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { CommonAppLayout } from '../../ui/components/layout/CommonAppLayout.jsx';
import { Calendar, Edit2, Key, Layers, Mail, User } from 'react-feather';
import { useParams } from 'react-router-dom';
import { getData } from "../../services/CRUDService";
import { EntityTypes } from "../../constants/data/EntityTypes";
import { toast } from "react-toastify";
import {Cookies} from "../../constants/data/Cookies";
import {UserRoles} from "../../constants/data/UserRoles";

export const UserProfilePage = ({ userId: propUserId }) => {
    const params = useParams();
    const actualRole = Cookies.getCookie(Cookies.mainRole);
    const currentUserInfo = Cookies.getCookie(Cookies.userInfo);
    const currentUserId = currentUserInfo?.userId;

    const userId = propUserId || params.userId || 'me';
    const isAdmin = actualRole === UserRoles.admin.value;

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const handleGetUserProfile = async () => {
            console.log('handleGetUserProfile called');
            try {
                let profile = null;

                const isViewingSelf = userId === 'me' || userId === currentUserId;

                if (isViewingSelf) {
                    // Bất kỳ ai xem chính mình → /user/me
                    profile = await getData(EntityTypes.user.MY_PROFILE, null, null);
                } else if (isAdmin) {
                    // Admin xem người khác → /user/:userId
                    profile = await getData(EntityTypes.user.PROFILE, null, userId);
                } else {
                    // Trường hợp khác (teacher, student xem người khác) → lỗi (nếu có)
                    toast.error('Bạn không có quyền xem thông tin người dùng này.');
                    return;
                }

                if (isMounted) {
                    setCurrentUser(profile);
                    console.log(profile);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || 'Lỗi tải dữ liệu');
                }
            }
        };

        handleGetUserProfile();

        return () => {
            isMounted = false;
        };
    }, [userId, isAdmin, currentUserId]);

    const getInitial = (name) => {
        return name ? name.trim().charAt(0).toUpperCase() : '?';
    };

    const getRoleLabel = (role) => {
        let label = '';
        if (role === 'TEACHER') label = 'GIÁO VIÊN';
        if (role === 'STUDENT') label = 'SINH VIÊN';
        if (role === 'ADMIN') label = 'QUẢN TRỊ VIÊN';
        return (
            <Badge bg="primary" className="me-1">
                {label}
            </Badge>
        );
    };

    if (!currentUser) {
        return (
            <CommonAppLayout>
                <Container className="px-0 mt-5">
                    <p>Đang tải dữ liệu...</p>
                </Container>
            </CommonAppLayout>
        );
    }

    return (
        <CommonAppLayout>
            <Container className="px-0 mt-5">
                <Row className="px-0 mb-4">
                    <Col>
                        <h5>Thông tin người dùng</h5>
                    </Col>
                </Row>

                <Row className="d-flex align-items-stretch">
                    <Col md={4} className="mb-4">
                        <Card className="text-center rounded-0 h-100">
                            <div style={{
                                width: '145px',
                                height: '145px',
                                borderRadius: '50%',
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                fontSize: '4.5em',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '20px auto',
                                userSelect: 'none'
                            }}>
                                {getInitial(currentUser.firstName)}
                            </div>
                            <Card.Body>
                                <Card.Title>{currentUser.lastName} {currentUser.firstName}</Card.Title>
                                <Card.Subtitle className="mt-2 mb-3 text-muted">@{currentUser.username}</Card.Subtitle>
                                <Card.Subtitle className="mb-3 text-muted">ID: {currentUser.userId}</Card.Subtitle>
                                <div className="mb-3">
                                    {getRoleLabel(currentUser.roles.at(0))}
                                </div>
                                <Button variant="outline-primary" size="sm">
                                    <Edit2 size={14} className="me-1" /> Chỉnh sửa thông tin
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={8} className="d-flex flex-column h-100">
                        <Card className="rounded-0 flex-fill mb-3">
                            <Card.Header>Chi tiết người dùng</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <User size={16} className="me-2" /> <strong>Giới tính:</strong> {currentUser.gender}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Calendar size={16} className="me-2" /> <strong>Ngày sinh:</strong> {currentUser.birthdate}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Mail size={16} className="me-2" /> <strong>Email:</strong> {currentUser.email}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Layers size={16} className="me-2" /> <strong>Trường:</strong> {currentUser.school}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Layers size={16} className="me-2" /> <strong>Khoa:</strong> {currentUser.department}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Calendar size={16} className="me-2" /> <strong>Thời gian tham gia:</strong> {currentUser.createdAt}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>

                        <Card className="rounded-0">
                            <Card.Header>Mật khẩu</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Key size={16} className="me-2" /> Đổi mật khẩu
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Key size={16} className="me-2" /> Quên mật khẩu
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </CommonAppLayout>
    );
};
