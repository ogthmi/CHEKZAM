import {Button, Col, Container, Row} from "react-bootstrap";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {Cookies} from "../../../constants/data/Cookies";
import {UserRoles} from "../../../constants/data/UserRoles";
import {CommonSortDropdown, CommonTable} from "../../../ui/components/CommonComponent";
import {useNavigate, useParams} from "react-router-dom";
import {SubmissionFieldBuilder} from "../../submission/SubmissionDataFields";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {createData} from "../../../services/CRUDService";
import {toast} from "react-toastify";

export const AssignmentSubmissionHistory = () => {
    const navigate = useNavigate();
    const {classroomId, assignmentId} = useParams();
    const isTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;

    const dataFields = SubmissionFieldBuilder.getFieldsByContext(classroomId ? "classroom-assignment-page" : "assignment-page", isTeacher);

    const sortFieldKeys = {
        id: dataFields.submissionId.value, createdAt: dataFields.submittedAt.value
    };

    const {
        queryParams, updateQueryParams, sortOptions, handleSortChange, objectData, totalPages, totalElements, message
    } = usePaginatedTable({
        entityType: classroomId ? EntityTypes.submission.INFO : EntityTypes.assignment.SUBMISSION,
        containerId: classroomId ? classroomId : assignmentId,
        itemId: assignmentId,
        defaultSortBy: dataFields.submittedAt.value,
        sortFieldKeys,
    });

    const formattedData = objectData.map(item => ({
        ...item,
        score: Number(item.score).toFixed(2)
    }))

    console.log(formattedData)

    const handleRowClick = (row) => {
        const field = dataFields.submissionId.value;
        navigate(`/submission/${row[field]}/details`);
    };

    const handleStartSubmission = async () => {
        const requestPayload = {
            assignmentId: assignmentId, classroomId: classroomId,
        };

        const response = await createData(EntityTypes.submission.START, null, null, requestPayload);
        console.log(response)
        if (response.success) {
            const submission = response.data.result;

            navigate(`../do`, {
                replace: true, state: {submission},
            });
        }
    };

    return (<Container className="p-0 mt-3">
        <Row>
            <Col lg={isTeacher ? 10 : 8}></Col>
            <Col>
                <CommonSortDropdown
                    sortOptions={sortOptions}
                    onSortChange={handleSortChange}
                />
            </Col>
            {!isTeacher && <Col> <Button className={"w-100"} onClick={handleStartSubmission}>
                Làm bài
            </Button></Col>}
        </Row>


        <CommonTable
            headers={Object.values(dataFields).map((f) => f.label)}
            fields={Object.values(dataFields).map((f) => f.value)}
            data={formattedData}
            message={message}
            underlinedColumns={[0]}
            onRowClick={handleRowClick}
        />
    </Container>)
}