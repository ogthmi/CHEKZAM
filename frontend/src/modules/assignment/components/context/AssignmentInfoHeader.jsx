import React, {useContext, useState, useEffect} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {AssignmentInfoContext} from "./AssignmentInfoContext";
import {AssignmentInfoEditForm} from "./AssignmentInfoEditForm";
import "../../../../css/Button.css";
import {
    formatAssignmentType,
    formatDateTimeToDisplay, formatDateTimeToProcess, formatDateTimeToRequest,
    formatDuration,
    formatMaxAttempts
} from "../../util/AssignmentDataFormatter";
import {useParams} from "react-router-dom";
import {updateData} from "../../../../services/CRUDService";
import {EntityTypes} from "../../../../constants/data/EntityTypes";
import {toast} from "react-toastify";
import {Cookies} from "../../../../constants/data/Cookies";
import {UserRoles} from "../../../../constants/data/UserRoles";

export const AssignmentInfoHeader = ({isInClassroom = false}) => {
    const [assignment] = useContext(AssignmentInfoContext);
    const {classroomId} = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const isTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;

    useEffect(() => {
        if (assignment) {
            const initData = {
                assignmentName: assignment.assignmentName || '',
                description: assignment.description || '',
                assignmentType: assignment.assignmentType || '',
                ...(classroomId && {
                    classroomId: classroomId || '',
                    duration: assignment.duration || 0,
                    maxAttempts: assignment.maxAttempts || 0,
                    shuffleEnabled: assignment.shuffleEnabled || false,
                    openTime: assignment.openTime ? formatDateTimeToProcess(assignment.openTime) : "",
                    endTime: assignment.endTime ? formatDateTimeToProcess(assignment.endTime) : "",
                })
            };
            setFormData(initData);
            setOriginalData(initData);
        }
    }, [assignment]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleSave = async () => {
        // Format các trường ngày trước khi gửi
        const formattedData = {
            ...formData,
            openTime: formatDateTimeToRequest(formData.openTime),
            closeTime: formatDateTimeToRequest(formData.closeTime),
            // thêm các trường ngày khác nếu có
        };
        const {success} = await updateData(
            EntityTypes.assignment.INFO,
            null,
            assignment.assignmentId,
            formattedData
        );
        if (success) {
            toast.success("Cập nhật thông tin bài tập thành công");
            setTimeout(() => {
                window.location.reload();
                setIsEditing(false);
            }, 3000);
        }
    };


    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    if (!assignment) return <p>Đang tải...</p>;

    return (
        <Container className="p-0">
            <Row className={"text-start"}>
                <Col lg={10}>
                    {isEditing ? (
                        <AssignmentInfoEditForm
                            formData={formData}
                            handleChange={handleChange}
                            isInClassroom={isInClassroom}
                        />
                    ) : (
                        <>
                            <h5 className="mt-2">{assignment.assignmentName.toUpperCase() || '—'}</h5>
                            <p className="text-muted">{assignment.description || ''}</p>
                            <Row>
                                <Col lg={6} className="text-start">
                                    <div className={"mb-2"}>
                                        <h6 className={"d-inline"}>Loại bài tập: </h6>
                                        {formatAssignmentType(assignment.assignmentType)}
                                    </div>
                                    <div className={"mb-2"}>
                                        <h6 className={"d-inline"}>Số câu hỏi: </h6>
                                        {assignment.totalQuestions || 0} câu
                                    </div>
                                    {isInClassroom
                                        ? <>
                                            {isTeacher && <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Thời gian giao bài: </h6>
                                                {assignment.assignedTime || '-'}
                                            </div>}
                                            <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Đảo đề tự động: </h6>
                                                {assignment.shuffleEnabled ? 'Có' : 'Không'}
                                            </div>
                                        </>
                                        : <div>
                                            <h6 className={"d-inline"}>Thời gian tạo: </h6>
                                            {assignment.createdAt || '-'}</div>
                                    }

                                </Col>
                                <Col lg={6} className="text-start">
                                    {isInClassroom && (
                                        <>
                                            <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Thời lượng làm bài: </h6>
                                                {formatDuration(assignment.duration)}
                                            </div>
                                            <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Số lượt làm bài: </h6>
                                                {formatMaxAttempts(assignment.maxAttempts)}
                                            </div>
                                            <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Thời gian mở bài: </h6>
                                                {formatDateTimeToDisplay(assignment.openTime)}
                                            </div>
                                            <div className={"mb-2"}>
                                                <h6 className={"d-inline"}>Hạn chót: </h6>
                                                {formatDateTimeToDisplay(assignment.endTime)}
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>


                        </>
                    )}
                </Col>

                <Col lg={2} className="text-lg-end text-center mt-3 mt-lg-0">
                    {isEditing ? (
                        <>
                            <Button variant="secondary" size="sm" className="me-2 mb-2"
                                    onClick={handleCancel}>Hủy</Button>
                            <Button variant="primary" size="sm" className=" mb-2" onClick={handleSave}>Lưu</Button>
                        </>
                    ) : (
                        <Button
                            variant="light"
                            size="sm"
                            className="w-md-100 w-auto"
                            onClick={() => setIsEditing(true)}
                        >
                            {
                                isTeacher ?
                                    isInClassroom ? "Chỉnh sửa thông tin giao bài"
                                        : "Chỉnh sửa thông tin bài tập"
                                    : undefined
                            }
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
};
