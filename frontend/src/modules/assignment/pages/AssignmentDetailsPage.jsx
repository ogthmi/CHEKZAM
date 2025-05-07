import {Container, Row, Col, Button} from "react-bootstrap";
import {AssignmentQuestionDisplay} from "../components/common/AssignmentQuestionDisplay";
import {CommonPagination} from "../../../ui/components/list-page/CommonPagination";
import {CommonSearchInput} from "../../../ui/components/list-page/CommonSearchInput";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {useContext} from "react";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {AssignmentInfoContext} from "../components/context/AssignmentInfoContext";


export const AssignmentDetailsPage = () => {
    const [currentAssignment] = useContext(AssignmentInfoContext)
    const assignmentId = currentAssignment?.assignmentId;


    const {
        queryParams,
        updateQueryParams,
        objectData,
        totalPages,
        totalElements,
        message
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.QUESTIONS,
        containerId: assignmentId,
        defaultSortBy: "questionOrder",
        sortFieldKeys: {id: "questionId"},
    });

    if (!assignmentId) {
        return <p>Đang tải</p>
    }

    console.log(objectData)


    return (
        <Container className={""}>
            <Row className={"mt-3 mb-4"}>
                <Col className={"px-0 mb-2 mb-lg-0"}>
                    <CommonSearchInput onSearch={(keyword) => updateQueryParams({keyword})}/>
                </Col>
            </Row>
            <CommonPagination
                pageNumber={queryParams.pageNumber}
                totalPages={totalPages}
                totalElements={totalElements}
                setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
            />
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