import {useLocation, useNavigate, useParams} from "react-router-dom";
import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";
import {Button, Col, Container, Row} from "react-bootstrap";
import {Endpoints} from "../../constants/links/Endpoints";

export const SubmissionResult = () => {
    const location = useLocation();
    const {userRole} = useParams();
    const navigate = useNavigate()
    const result = location.state?.result;
    console.log(result);

    return (
        <>
            <CommonAppLayout/>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Container className="text-center" style={{ maxWidth: "400px" }}>
                    <p>Bạn vừa hoàn thành bài tập</p>
                    <h6 className="mb-5 text-primary">{result.assignmentName.toUpperCase()}</h6>

                    <h6 className="mb-1">Kết quả</h6>
                    <p className="fs-1 fw-medium text-primary mb-4">{Number(result.score).toFixed(2)}</p>

                    <div className={"mb-5"}>
                        <div className="mb-2 d-flex justify-content-between">
                            <span>Số câu đúng</span>
                            <span>{result.totalCorrectQuestions}/{result.totalQuestions}</span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between">
                            <span>Thời gian bắt đầu</span>
                            <span>{result.startedAt}</span>
                        </div>
                        <div className="mb-2 d-flex justify-content-between">
                            <span>Thời gian nộp bài</span>
                            <span>{result.submittedAt}</span>
                        </div>
                        <div className="mb-4 d-flex justify-content-between">
                            <span>Tổng thời lượng</span>
                            <span>{result.durationInSeconds} giây</span>
                        </div>
                    </div>

                    <Button className={"mt-3"} size="sm" variant={"outline-primary"} onClick={() => navigate(Endpoints.classroom.root(userRole.toLowerCase()))}>
                        Về trang chủ
                    </Button>
                </Container>
            </div>


        </>
    )
}