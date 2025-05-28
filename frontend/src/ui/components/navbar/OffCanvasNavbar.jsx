import React from 'react';
import { Navbar, Offcanvas, Nav } from 'react-bootstrap';
import { NavLinks } from './NavLinks';

export function OffcanvasNavbar({showNavLinks = true}) {
    return (
        <Navbar.Offcanvas id="offcanvasNavbar" placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <img src="/assets/CHEKZAM-sublogo.png" alt="Logo" className="logo me-2" />
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="me-auto">
                    {showNavLinks && <NavLinks />}
                </Nav>
            </Offcanvas.Body>
        </Navbar.Offcanvas>
    );
}
