import {Col, Container, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {usePaginatedTable} from "../../ui/hooks/pagination/usePaginatedTable";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {AnswerNotation, AssignmentQuestionDisplay} from "../assignment/components/common/AssignmentQuestionDisplay";
import {CommonPagination} from "../../ui/components/list-page/CommonPagination";
import {getData} from "../../services/CRUDService";
import {useEffect, useState} from "react";

export const SubmissionDetailsPage = () => {
    const {submissionId} = useParams();
    const [submissionInfo, setSubmissionInfo] = useState(null);
    const getSubmissionInfo = async () => {
        try {
            const response = await getData(EntityTypes.submission.INFO, submissionId, null);
            setSubmissionInfo(response);
        } catch (e) {
        }
    }
    useEffect(() => {
            getSubmissionInfo()
        }, [submissionId]
    )
    console.log(submissionInfo)
    const {
        queryParams,
        updateQueryParams,
        objectData,
        totalPages,
        totalElements,
        message
    } = usePaginatedTable({
        entityType: EntityTypes.submission.DETAILS,
        containerId: submissionId,
        defaultSortBy: "questionOrder",
        sortFieldKeys: {id: "questionId"},
    });
    console.log(objectData)

    const calculateDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes} phút ${seconds} giây`
    }

    return (
        <Container className={"p-2 mt-3"}>
            <Row className={"my-3"}>
                <h5 className={"px-0"}>{submissionInfo?.assignmentName.toUpperCase()}</h5>
                <p className={"text-muted my-1 px-0"}>Lớp học: {submissionInfo?.classroomName.toUpperCase()}</p>
                <p className={"text-muted mt-1 mb-4 px-0"}>Sinh viên: {submissionInfo?.fullName}</p>

                <Col lg={6} className={"px-0"}>
                    <p><strong>Lượt làm bài</strong>: {submissionInfo?.takingAttempt}</p>
                    <p><strong>Thời gian bắt đầu:</strong> {submissionInfo?.startedAt}</p>
                    <p><strong>Thời gian nộp bài:</strong> {submissionInfo?.submittedAt}</p>
                </Col>
                <Col lg={6} className={"px-0"}>
                    <p><strong>Điểm:</strong> {Number(submissionInfo?.score).toFixed(2)}</p>
                    <p><strong>Số câu
                        đúng:</strong> {submissionInfo?.totalCorrectQuestions}/ {submissionInfo?.totalQuestions}</p>
                    <p><strong>Thời lượng:</strong> {calculateDuration(submissionInfo?.durationInSeconds)}</p>
                </Col>
            </Row>
            <CommonPagination
                pageNumber={queryParams.pageNumber}
                totalPages={totalPages}
                totalElements={totalElements}
                setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
            />
            <AnswerNotation/>
            <Row className={"p-0 mb-2"}>
                {objectData.map((question, key) => (
                    <AssignmentQuestionDisplay
                        key={key}
                        question={question}
                    />
                ))}
            </Row>

        </Container>
    )
}