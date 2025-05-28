import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, ListGroup, Row} from 'react-bootstrap';
import {CommonAppLayout} from '../../../ui/components/layout/CommonAppLayout.jsx';
import {Edit2, Key} from 'react-feather';
import {useParams} from 'react-router-dom';
import {getData, updateData} from "../../../services/CRUDService";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {toast} from "react-toastify";
import {Cookies} from "../../../constants/data/Cookies";
import {UserRoles} from "../../../constants/data/UserRoles";
import {UserProfileEditForm} from "../components/UserProfileEditForm";
import {UserProfileDetailView} from "../components/UserProfileDetailView";
import {UserProfileNameCard} from "../components/UserProfileNameCard";
import ChangePasswordForm from "../components/ChangePasswordForm";
import moment from "moment";

export const UserProfilePage = ({userId: propUserId}) => {
    const params = useParams();
    const actualRole = Cookies.getCookie(Cookies.mainRole);
    const currentUserInfo = Cookies.getCookie(Cookies.userInfo);
    const currentUserId = currentUserInfo?.userId;

    const userId = propUserId || params.userId || 'me';
    const isAdmin = actualRole === UserRoles.admin.value;

    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const isViewingSelf = userId === 'me' || userId === currentUserId;


    useEffect(() => {
        let isMounted = true;

        const handleGetUserProfile = async () => {
            try {
                let profile = null;
                const isViewingSelf = userId === 'me' || userId === currentUserId;

                if (isViewingSelf) {
                    profile = await getData(EntityTypes.user.MY_PROFILE, null, null);
                    const basicUserInfoResponse = {
                        userId: profile.userId,
                        username: profile.username,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        role: profile.roles?.[0] || ''
                    };
                    setCurrentUser(profile);
                    Cookies.setCookie(Cookies.userInfo, basicUserInfoResponse);
                } else if (isAdmin) {
                    profile = await getData(EntityTypes.user.PROFILE, null, userId);
                } else {
                    toast.error('Bạn không có quyền xem thông tin người dùng này.');
                    return;
                }

                if (isMounted) {
                    setCurrentUser(profile);
                    setEditedUser(profile);
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedUser({...editedUser, [name]: value});
    };

    const handleSave = async () => {
        try {
            const isViewingSelf = userId === 'me' || userId === currentUserId;

            if (isViewingSelf) {
                editedUser.birthdate = moment(editedUser.birthdate).format('DD-MM-YYYY');
                const {result} = await updateData(EntityTypes.user.MY_PROFILE, null, null, editedUser);
                const basicUserInfoResponse = {
                    userId: result.userId,
                    username: result.username,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    role: result.roles?.[0] || ''
                };
                setCurrentUser(result);
                Cookies.setCookie(Cookies.userInfo, basicUserInfoResponse);
            } else if (isAdmin) {
                editedUser.birthdate = moment(editedUser.birthdate).format('DD-MM-YYYY');
                const {result} = await updateData(EntityTypes.user.PROFILE, null, userId, editedUser);
                console.log(result)
                setCurrentUser(result);
            } else {
                toast.error('Bạn không có quyền cập nhật thông tin người dùng này.');
                return;
            }

            setIsEditing(false);
            toast.success('Cập nhật thành công!');
        } catch (error) {
            toast.error('Lỗi cập nhật: ' + error.message);
        }
    };

    const handleCancel = () => {
        setEditedUser(currentUser);
        setIsEditing(false);
    };

    const handleChangePasswordSave = async (passwordData) => {

        if (isViewingSelf) {
            const {success} = await updateData(EntityTypes.user.MY_PASSWORD, null, null, passwordData);
            if (success) {
                toast.success('Đổi mật khẩu thành công!');
                setIsChangingPassword(false);
            }
        } else {
            toast.error("Người dùng không có quyền đổi mật khẩu")
        }
    };

    const handleChangePasswordCancel = () => {
        setIsChangingPassword(false);
    };

    if (!currentUser) {
        return (<CommonAppLayout>
            <Container className="px-0 mt-5">
                <p>Đang tải dữ liệu...</p>
            </Container>
        </CommonAppLayout>);
    }

    if (!currentUser) {
        return (<CommonAppLayout>
            <Container className="px-0 mt-5">
                <p>Đang tải dữ liệu...</p>
            </Container>
        </CommonAppLayout>);
    }

    return (<CommonAppLayout>
        <Container className="px-0 mt-5">
            <Row className="px-0 mb-4">
                <Col>
                    <h5>Thông tin người dùng</h5>
                </Col>
            </Row>

            <Row className="d-flex">
                <Col md={4} className="mb-4">
                    <UserProfileNameCard user={currentUser}/>
                </Col>

                <Col md={8} className="d-flex flex-column">
                    <Card className="rounded-0 flex-fill mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Chi tiết người dùng</span>
                            {!isEditing && (<Button variant="light" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit2 size={14} className="me-1"/> Chỉnh sửa thông tin
                            </Button>)}
                        </Card.Header>

                        <Card.Body className="p-0">
                            {isEditing ? (<UserProfileEditForm
                                editedUser={editedUser}
                                onChange={handleInputChange}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />) : (<>
                                <UserProfileDetailView user={currentUser}/>
                            </>)}
                        </Card.Body>
                    </Card>


                    <Card className="rounded-0 mb-5">
                        <Card.Header>
                            Mật khẩu
                        </Card.Header>
                        <ListGroup variant="flush">
                            {isViewingSelf ?
                                <>
                                    <ListGroup.Item>
                                        <Button
                                            variant="link"
                                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                                            className="text-black text-decoration-none p-0"
                                        >
                                            <Key size={16} className="me-2"/>
                                            Đổi mật khẩu
                                        </Button>
                                        {isChangingPassword && (<ChangePasswordForm
                                            onSave={handleChangePasswordSave}
                                            onCancel={handleChangePasswordCancel}
                                            className="mt-3"
                                        />)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Key size={16} className="me-2"/>
                                        Quên mật khẩu
                                    </ListGroup.Item>
                                </>
                                : undefined
                                // : <ListGroup.Item>
                                //     <Key size={16} className="me-2"/>
                                //     Đặt lại mật khẩu
                                // </ListGroup.Item>
                            }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    </CommonAppLayout>);
};
