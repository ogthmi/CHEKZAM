import React from "react";
import {Badge, Button, Card} from "react-bootstrap";
import {CommonBadge} from "../../../ui/components/badge/CommonBadge";
import {Edit2} from "react-feather";
import '../../../css/Badge.css'
import {UserRoles} from "../../../constants/data/UserRoles";

const getInitial = (name) => {
    return name ? name.trim().charAt(0).toUpperCase() : '?';
};

export const getUserRoleBadge = (role) => {
    let label = '';
    let variant = '';
    if (role === UserRoles.teacher.value) {
        label = UserRoles.teacher.label.toUpperCase();
        variant = "danger";
    }
    else if (role === UserRoles.student.value) {
        label = UserRoles.student.label.toUpperCase();
        variant = "success";
    }
    else if (role === UserRoles.admin.value) {
        label = UserRoles.admin.label.toUpperCase();
        variant = "primary";
    }
    else {
        label = "Chưa xác định".toUpperCase();
        variant = "dark";
    }
    return (
        <CommonBadge label={label} variant={variant} className="mb-2"/>
    );
};

export const UserProfileNameCard = ({user}) => {
    return (
        <Card className="text-center rounded-0">
            <div style={{
                width: '145px',
                height: '145px',
                borderRadius: '50%',
                backgroundColor: '#666',
                color: '#fff',
                fontSize: '4.5em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px auto',
                userSelect: 'none',
                fontWeight: '500',
            }}>
                {getInitial(user.firstName)}
            </div>
            <Card.Body>
                <Card.Title>{user.lastName} {user.firstName}</Card.Title>
                <Card.Subtitle className="mt-2 mb-3 text-muted">@{user.username}</Card.Subtitle>
                <Card.Subtitle className="mb-3 text-muted">ID: {user.userId}</Card.Subtitle>
                <div className="mb-3">
                    {getUserRoleBadge(user.roles?.[0] || '')}
                </div>
            </Card.Body>
        </Card>
    )
}