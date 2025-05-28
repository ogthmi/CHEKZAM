import {useCallback, useContext, useState} from "react";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {Endpoints} from "../../../constants/links/Endpoints";
import {Container, Row} from "react-bootstrap";
import {CommonTable} from "../../../ui/components/list-page/CommonTable";
import {CommonPagination} from "../../../ui/components/list-page/CommonPagination";
import {useNavigate} from "react-router-dom";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {ClassroomModalRenderer} from "../../classroom/components/modal/ClassroomModalRenderer";
import {AssignmentRowActions} from "../components/dropdown/AssignmentRowActions";
import {AssignmentFieldBuilder} from "../util/AssignmentDataFields";
import {formatAssignmentType} from "../util/AssignmentDataFormatter";
import {AssignmentModalRenderer} from "../components/modal/AssignmentModalRenderer";


export const AssignmentListPage = () => {
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);

    const dataFields = AssignmentFieldBuilder.getGeneralInfoFields(true);

    const sortFieldKeys = {
        name: dataFields.assignmentName.value, id: dataFields.assignmentId.value, createdAt: dataFields.createdAt.value,
    };


    const {
        queryParams, updateQueryParams, sortOptions, handleSortChange, objectData, totalPages, totalElements, message
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.INFO,
        containerId: null,
        defaultSortBy: dataFields.assignmentName.value,
        sortFieldKeys,
    });

    const cleanedObjectData = objectData.map(assignment => ({
        ...assignment, assignmentType: formatAssignmentType(assignment.assignmentType),
    }))

    const handleRowClick = (row) => {
        const field = dataFields.assignmentId.value;
        setOpenDropdownId(null);
        navigate(`${row[field]}${Endpoints.assignment.content}`);
    };

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    const renderActions = useCallback((row) => (
        <CommonActionDropdown
            isOpen={openDropdownId === row[dataFields.assignmentId.value]}
            onToggle={() => handleToggleDropdown(row[dataFields.assignmentId.value])}
            actions={AssignmentRowActions({
                page: AssignmentListPage, row, dataFields, navigate, showModal,
            })}
        />
    ), [openDropdownId, dataFields, navigate, showModal]);


    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3"><h5>Bài tập của tôi</h5></Row>

            <CommonListToolbar
                onSearch={(keyword) => updateQueryParams({keyword})}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                actionButtonText={'Tạo bài tập'}
                onActionButtonClick={() => navigate(`${Endpoints.assignment.create('teacher')}`)}
            />

            <CommonTable
                headers={Object.values(dataFields).map((field) => field.label)}
                fields={Object.values(dataFields).map((field) => field.value)}
                data={cleanedObjectData}
                message={message}
                renderActions={(row) => renderActions(row)}
                leftAlignedColumns={[1, 2]}
                underlinedColumns={[1]}
                onRowClick={handleRowClick}
            />

            <CommonPagination
                pageNumber={queryParams.pageNumber}
                totalPages={totalPages}
                totalElements={totalElements}
                setPageNumber={(pageNumber) => updateQueryParams({pageNumber})}
            />

            <AssignmentModalRenderer/>
        </Container>
    );
}