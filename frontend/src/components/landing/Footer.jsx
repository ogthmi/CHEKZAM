import { Container, Row, Col } from "react-bootstrap";

export function Footer() {
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