import React from 'react';
import { Nav } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { RootEndpoints, Endpoints } from '../../constants/links/Endpoints';

const links = {
    landing: [
        { name: 'Giới thiệu', href: '#landing' },
        { name: 'Tính năng', href: '#features' },
        { name: 'Liên hệ', href: '#contact' }
    ],
    auth: [
        { name: 'Trang chủ', href: Endpoints.home.landing },
    ],
    admin: [
        { name: 'Thống kê', href: Endpoints.admin.dashboard },
        { name: 'Người dùng', href: '' },
    ],
    teacher: [
        { name: 'Lớp học', href: Endpoints.teacher.classroom },
        { name: 'Bài tập', href: Endpoints.teacher.assignment }
    ],
    student: [
        { name: 'Lớp học', href: Endpoints.student.classroom }
    ]
};

function DefineCurrentLinkByLocation() {
    const location = useLocation();
    const pathname = location.pathname;

    const endpointMap = {
        [RootEndpoints.auth]: links.auth,
        [RootEndpoints.admin]: links.admin,
        [RootEndpoints.teacher]: links.teacher,
        [RootEndpoints.student]: links.student
    };

    const currentLinks = Object.keys(endpointMap).find(endpoint => pathname.startsWith(endpoint))
        ? endpointMap[Object.keys(endpointMap).find(endpoint => pathname.startsWith(endpoint))]
        : links.landing;

    return currentLinks;
}

export function NavLinks() {
    const currentLinks = DefineCurrentLinkByLocation();

    return (
        <>
            {currentLinks.map((link, index) => (
                <Nav.Link key={index} href={link.href} className='me-3'>
                    {link.name}
                </Nav.Link>
            ))}
        </>
    );
}
