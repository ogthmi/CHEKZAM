import React from 'react';
import {Nav} from "react-bootstrap";
import {useLocation} from 'react-router-dom';
import {RootEndpoints, Endpoints} from '../../constants/links/Endpoints';

const links = {
    landing: [
        {name: 'Giới thiệu', href: '#landing'},
        {name: 'Tính năng', href: '#features'},
        {name: 'Liên hệ', href: '#contact'}
    ],
    auth: [
        {name: 'Trang chủ', href: Endpoints.home.landing},
    ],
    admin: [
        {name: 'Thống kê', href: Endpoints.admin.classroomDashboard},
        {name: 'Người dùng', href: Endpoints.admin.userManagement},
    ],
    teacher: [
        {name: 'Lớp học', href: Endpoints.classroom.root},
        {name: 'Bài tập', href: Endpoints.assignment.root}
    ],
    student: [
        {name: 'Lớp học', href: Endpoints.classroom.root}
    ]
};

function DefineCurrentLinkByLocation() {
    const {pathname} = useLocation();

    const role = pathname.split('/')[1];

    const endpointMap = {
        auth: links.auth,
        admin: links.admin,
        teacher: links.teacher,
        student: links.student
    };

    return endpointMap[role] || links.landing;
}

export function NavLinks() {
    const currentLinks = DefineCurrentLinkByLocation();
    const {pathname} = useLocation();
    const role = pathname.split('/')[1];

    return (
        <>
            {currentLinks.map((link, index) => {
                const href = typeof link.href === 'function' ? link.href(role) : link.href;

                return (
                    <Nav.Link key={index} href={href} className='me-3'>
                        {link.name}
                    </Nav.Link>
                );
            })}
        </>
    );
}

