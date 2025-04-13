import React from 'react';
import { Nav } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { MAIN_ENDPOINTS, SUB_ENDPOINTS } from '../../constants/endPoints';

const links = {
    landing: [
        { name: 'Giới thiệu', href: '#landing' },
        { name: 'Tính năng', href: '#features' },
        { name: 'Liên hệ', href: '#contact' }
    ],
    auth: [
        { name: 'Trang chủ', href: SUB_ENDPOINTS.home.landing },
    ],
    admin: [
        { name: 'Thống kê', href: SUB_ENDPOINTS.admin.dashboard },
        { name: 'Người dùng', href: '' },
    ],
    teacher: [
        { name: 'Lớp học', href: SUB_ENDPOINTS.teacher.classroom }
    ],
    student: [
        { name: 'Lớp học', href: SUB_ENDPOINTS.student.classroom }
    ]
};

function DefineCurrentLinkByLocation() {
    const location = useLocation();
    const pathname = location.pathname;

    const endpointMap = {
        [MAIN_ENDPOINTS.auth]: links.auth,
        [MAIN_ENDPOINTS.admin]: links.admin,
        [MAIN_ENDPOINTS.teacher]: links.teacher,
        [MAIN_ENDPOINTS.student]: links.student
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
