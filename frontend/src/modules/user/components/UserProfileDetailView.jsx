import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { User, Calendar, Mail, Layers } from 'react-feather';
import { formatGender } from '../util/UserDataFormatter';

export const UserProfileDetailView = ({ user }) => {
    if (!user) return null;

    return (
        <ListGroup variant="flush">
            <ListGroup.Item>
                <User size={16} className="me-2" /> <strong>Giới tính:</strong> {formatGender(user.gender)}
            </ListGroup.Item>
            <ListGroup.Item>
                <Calendar size={16} className="me-2" /> <strong>Ngày sinh:</strong> {user.birthdate}
            </ListGroup.Item>
            <ListGroup.Item>
                <Mail size={16} className="me-2" /> <strong>Email:</strong> {user.email}
            </ListGroup.Item>
            <ListGroup.Item>
                <Layers size={16} className="me-2" /> <strong>Trường:</strong> {user.school}
            </ListGroup.Item>
            <ListGroup.Item>
                <Layers size={16} className="me-2" /> <strong>Khoa/Lớp:</strong> {user.department}
            </ListGroup.Item>
            <ListGroup.Item>
                <Calendar size={16} className="me-2" /> <strong>Thời gian tham gia:</strong> {user.createdAt}
            </ListGroup.Item>
        </ListGroup>
    );
};
