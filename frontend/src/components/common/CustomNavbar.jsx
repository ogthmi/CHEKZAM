import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { Logo } from '../navbar/Logo';
import { OffcanvasNavbar } from '../navbar/OffCanvasNavbar';
import { SignButtons } from '../navbar/SignButton';
import { FullNamePlaceholder } from '../navbar/FullNamePlaceholder';

export function CustomNavbar() {
    const location = useLocation();

    return (
        <Navbar expand="md" sticky="top" bg="white" className="p-0 shadow-sm">
            <Container fluid className="mx-3 p-1 align-items-center">
                <div>
                    <Row>
                        <Col><Logo /></Col>
                        <Col className='d-flex align-items-center'><Navbar.Toggle aria-controls="offcanvasNavbar" >
                            <FontAwesomeIcon icon={faBars} className="text-primary" />
                        </Navbar.Toggle></Col>
                    </Row>
                </div>

                <OffcanvasNavbar />

                {location.pathname === '/' && <SignButtons />}
                {location.pathname !== '/' && !location.pathname.startsWith('/auth') && <FullNamePlaceholder />}
            </Container>
        </Navbar>
    );
}
