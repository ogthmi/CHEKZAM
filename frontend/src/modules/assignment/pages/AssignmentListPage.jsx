import {useCallback, useContext, useEffect, useState} from "react";
import {usePaginatedData} from "../../../ui/hooks/pagination/usePaginatedData";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {Endpoints} from "../../../constants/links/Endpoints";
import {Col, Container, Row} from "react-bootstrap";
import {CommonSearchInput} from "../../../ui/components/list-page/CommonSearchInput";
import {CommonSortDropdown} from "../../../ui/components/list-page/CommonSortDropdown";
import {CommonTable} from "../../../ui/components/list-page/CommonTable";
import {CommonPagination} from "../../../ui/components/list-page/CommonPagination";
import {CommonLinkButton} from "../../../ui/components/CommonLinkButton";
import {useNavigate} from "react-router-dom";
import {Cookies} from "../../../constants/data/Cookies";
import {UserRoles} from "../../../constants/data/UserRoles";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {ResponseDataFields} from "../../../constants/data/ResponseDataFields";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {ClassroomRowActions} from "../../classroom/components/common/ClassroomRowActions";
import {ClassroomModalRenderer} from "../../classroom/components/modal/ClassroomModalRenderer";
import {AssignmentRowActions} from "../components/dropdown/AssignmentRowActions";


export const AssignmentListPage = () => {
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);

    const dataFields = ResponseDataFields.AssignmentInfo(true);

    const sortFieldKeys = {
        name: "assignmentName",
        id: "assignmentId",
        createdAt: "createdAt"
    };

    const {
        queryParams,
        updateQueryParams,
        sortOptions,
        handleSortChange,
        objectData,
        totalPages,
        totalElements,
        message
    } = usePaginatedTable({
        entityType: EntityTypes.assignment.INFO,
        containerId: null,
        defaultSortBy: dataFields.assignmentName.value,
        sortFieldKeys,
    });

    const cleanedObjectData = objectData.map(assignment => ({
        ...assignment,
            assignmentType: assignment.assignmentType === "SINGLE_CHOICE" ? "Trắc nghiệm một đáp án" : assignment.assignmentType === "MULTIPLE_CHOICE"? "Trắc nghiệm nhiều đáp án" : "-"
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
                renderActions={(row) => (
                    <CommonActionDropdown
                        isOpen={openDropdownId === row[dataFields.assignmentId.value]}
                        onToggle={() => handleToggleDropdown(row[dataFields.assignmentId.value])}
                        actions={AssignmentRowActions({
                            page: AssignmentListPage,
                            row: row,
                            dataFields: dataFields,
                            navigate: navigate,
                            showModal: null
                        })}
                    />
                )}
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

            <ClassroomModalRenderer/>
        </Container>
    );
}