import React from 'react';
import {useLocation} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import {Cookies} from "../../../constants/data/Cookies";
import {Endpoints} from "../../../constants/links/Endpoints";

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
        // {name: 'Thống kê', href: Endpoints.admin.classroomDashboard},
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
    const { pathname } = useLocation();
    const actualRole = Cookies.getCookie(Cookies.mainRole)?.toLowerCase(); // e.g. 'admin'

    const endpointMap = {
        auth: links.auth,
        admin: links.admin,
        teacher: links.teacher,
        student: links.student
    };

    // Ưu tiên theo pathname
    const firstSegment = pathname.split('/')[1]; // e.g. '', 'auth', 'admin'
    if (firstSegment in endpointMap) {
        return endpointMap[firstSegment];
    }

    // Nếu là trang landing
    if (pathname === '/' || pathname.startsWith('#')) {
        return links.landing;
    }

    // Fallback: dùng role từ cookie nếu không rõ pathname
    return endpointMap[actualRole] || links.auth;
}

export function NavLinks() {
    const currentLinks = DefineCurrentLinkByLocation();
    const { pathname } = useLocation();
    const actualRole = Cookies.getCookie(Cookies.mainRole)?.toLowerCase();

    return (
        <>
            {currentLinks.map((link, index) => {
                const href = typeof link.href === 'function' ? link.href(actualRole) : link.href;

                // Check if the current pathname is exactly the link's href or starts with it
                // Special case for landing page with hash links
                const isActive = pathname === href || pathname.startsWith(href) || (href.startsWith('#') && pathname.includes(href));

                return (
                    <Nav.Link
                        key={index}
                        href={href}
                        className={`me-3 ${isActive ? 'fw-bold' : ''}`}
                        active={isActive}
                    >
                        {link.name}
                    </Nav.Link>
                );
            })}
        </>
    );
}