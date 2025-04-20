import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkButton } from "../../components/button/LinkButton"
import { AllPagesLayout } from '../../components/layout/AllPagesLayout.jsx';
import { Endpoints } from '../../constants/links/Endpoints.js';

export function LandingPage() {
    return (
        <AllPagesLayout>
            <Header />
            <Feartures />
            <Footer />
        </AllPagesLayout>
    );
}

function Header() {
    return (
        <header id='#landing' className="py-5">
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} className="text-lg-start text-center">
                        <div>
                            <img src="/assets/CHEKZAM-logo.png" alt="Classroom" className="img-fluid" />
                            <h3 className="px-4 pb-4 px-lg-0">Quản lý lớp học trực tuyến đơn giản và hiệu quả</h3>
                        </div>
                        <div>
                            <LinkButton href="#features" variant="light" className="me-2" content="Tìm hiểu thêm" />
                            <LinkButton href={Endpoints.auth.signup} content="Đăng ký ngay" />
                        </div>
                    </Col>
                    <Col lg={6} className="py-5 text-lg-end text-center">
                        <img src="/assets/4055619.jpg" alt="Classroom Illustration" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

function Footer() {
    return (
        <footer id='contact' className='bg-main text-light py-3'>
            <Container className='mt-4'>
                <Row>
                    <Col md={6} className='d-flex align-items-center text-center text-md-start'>
                        <div>
                            <img src="/assets/CHEKZAM-logo-white.png" alt="CHEKZAM-logo" className="logo-footer pb-2" />
                            <h6 className="text-uppercase pb-2">Hệ thống quản lý lớp học trực tuyến</h6>
                            <p>© 2025 CHEKZAM. Bảo lưu mọi quyền hạn.</p>
                        </div>
                    </Col>
                    <Col md={6} className='text-center text-md-end mt-md-0 mt-4'>
                        <div>
                            <h6>Liên hệ</h6>
                            <p>0123456789</p>
                        </div>
                        <div>
                            <h6>Email hỗ trợ</h6>
                            <p>someone@example.com</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

function Feartures() {
    return (
        <Container id='features'>
            <Row>
                {/* <h3 className="px-4 pb-4 px-lg-0">Tính năng của CHEKZAM - làm thêm nhé</h3> */}
            </Row>
        </Container>
    );
}



