import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {CommonLinkButton} from "../../../ui/components/CommonLinkButton"
import {CommonAppLayout} from '../../../ui/components/layout/CommonAppLayout.jsx';
import {Endpoints} from '../../../constants/links/Endpoints.js';
import {Users, FileText, BarChart, Clock, Shield, CheckCircle} from 'react-feather';

export function PublicLandingPage() {
    return (<CommonAppLayout>
        <Header/>
        <div style={{height: '100px'}}></div>
        <Features/>
        <div style={{height: '100px'}}></div>
        <Footer/>
    </CommonAppLayout>);
}

function Header() {
    return (
        <header id='landing'
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '4rem',
                    paddingBottom: '4rem',
                    backgroundColor: '#fff',
                    overflow: 'hidden'
                }}>
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} className="text-lg-start text-center pe-lg-4 pe-0 mb-5 mb-lg-0">
                        <img src="/assets/CHEKZAM-logo.png" alt="Classroom" className="img-fluid"/>
                        <h3 className="pb-2 fw-semibold" style={{lineHeight: '1.6'}}>Quản lý lớp học trực tuyến và tổ chức bài tập đơn giản và hiệu quả</h3>
                        <h5 style={{lineHeight: '1.6'}} className="fw-normal text-muted px-4 px-lg-0 pb-4">
                            Nền tảng toàn diện giúp giáo viên quản lý lớp học, tạo bài kiểm tra trắc nghiệm
                            và theo dõi tiến độ học tập của học sinh.
                        </h5>
                        <div>
                            <CommonLinkButton href="#features" variant="light" className="me-2"
                                              content="Tìm hiểu thêm"/>
                            <CommonLinkButton href={Endpoints.auth.signup} content="Đăng ký ngay"/>
                        </div>
                    </Col>
                    <Col lg={6} className="text-lg-end text-center mt-lg-0 mt-5">
                        <img src="/assets/4055619.jpg" alt="Classroom Illustration" className="img-fluid"/>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

function Footer() {
    return (<footer id='contact' className='bg-main text-light pt-5 pb-3'>
        <Container className=''>
            <Row>
                <Col md={6} className='d-flex align-items-center text-center text-md-start'>
                    <div>
                        <img src="/assets/CHEKZAM-logo-white.png" alt="CHEKZAM-logo" className="logo-footer pb-2"/>
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
    </footer>);
}

function Features() {
    return (
        <Container id="features" className={"px-5"}>
            <section  className="w-full py-16 bg-white">
                <div className="text-center mb-10">
                    <span
                        className="inline-block text-white text-sm px-4 py-1"
                        style={{borderRadius: '5px', background: 'var(--blue-900'}}
                    >
                        Tính năng nổi bật
                    </span>
                    <h2 className="text-3xl text-md-4xl font-bold mt-4 mb-2">
                        Giải pháp toàn diện cho việc dạy và học trực tuyến
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        CHEKZAM cung cấp đầy đủ công cụ để quản lý lớp học và tạo bài kiểm tra trắc nghiệm hiệu quả
                    </p>
                </div>

                <Row className={"px-5 d-flex justify-content-between"}>
                    <Col md={5} className="p-3 mb-4">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 ">
                                <Users/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Quản lý lớp học</h3>
                                <p className="text-gray-600">
                                    Tạo và quản lý nhiều lớp học, thêm học sinh, phân công bài tập và theo dõi tiến độ
                                    học tập.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 mt-8">
                            <div className="p-2 ">
                                <BarChart/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Phân tích kết quả</h3>
                                <p className="text-gray-600">
                                    Xem báo cáo chi tiết về kết quả học tập của từng học sinh và toàn lớp, phát hiện
                                    điểm mạnh và điểm yếu.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 mt-8">
                            <div className="p-2 ">
                                <Shield/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Bảo mật dữ liệu</h3>
                                <p className="text-gray-600">
                                    Bảo vệ thông tin cá nhân và dữ liệu học tập của học sinh với hệ thống bảo mật tiên
                                    tiến.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={1}></Col>
                    {/* Column 2 */}
                    <Col md={5} className="p-3 mb-4">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 ">
                                <FileText/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Tạo bài kiểm tra trắc nghiệm</h3>
                                <p className="text-gray-600">
                                    Dễ dàng tạo bài kiểm tra trắc nghiệm với nhiều loại câu hỏi khác nhau, tùy chỉnh
                                    thời gian và điểm số.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 mt-8">
                            <div className="p-2 ">
                                <Clock/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Tự động chấm điểm</h3>
                                <p className="text-gray-600">
                                    Hệ thống tự động chấm điểm bài kiểm tra trắc nghiệm, tiết kiệm thời gian và công sức
                                    cho giáo viên.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 mt-8">
                            <div className="p-2 ">
                                <CheckCircle/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Dễ dàng sử dụng</h3>
                                <p className="text-gray-600">
                                    Giao diện thân thiện, dễ sử dụng cho cả giáo viên và học sinh, không cần kiến thức
                                    kỹ thuật.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}


