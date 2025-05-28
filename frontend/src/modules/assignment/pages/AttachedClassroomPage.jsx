import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {ResponseDataFields} from "../../../constants/data/ResponseDataFields";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {Endpoints} from "../../../constants/links/Endpoints";
import {Container, Row} from "react-bootstrap";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {CommonTable} from "../../../ui/components/list-page/CommonTable";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {AssignmentRowActions} from "../components/dropdown/AssignmentRowActions";
import {CommonPagination} from "../../../ui/components/list-page/CommonPagination";
import {ClassroomModalRenderer} from "../../classroom/components/modal/ClassroomModalRenderer";
import {AssignmentInfoContext} from "../components/context/AssignmentInfoContext";
import {CommonScrollToTopButton} from "../../../ui/components/scroll/CommonScrollToTopButton";
import {CommonLoadingSpinner} from "../../../ui/components/spinner/CommonLoadingSpinner";

export const AttachedClassroomPage = () => {
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);
    const [currentAssignment] = useContext(AssignmentInfoContext);
    const assignmentId = currentAssignment?.assignmentId;

    const dataFields = ResponseDataFields.AssignmentClassroom("attached-classroom");

    const sortFieldKeys = {
        name: "classroomName",
        id: "classroomId",
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
        entityType: EntityTypes.assignment.ATTACHED_CLASSROOM,
        containerId: assignmentId,
        defaultSortBy: dataFields.classroomName.value,
        sortFieldKeys,
    });

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    if (!assignmentId) {
        return <p>Đang tải...</p>;
    }

    return (
        <Container className={"px-0"}>
            {/*<CommonListToolbar*/}
            {/*    onSearch={(keyword) => updateQueryParams({keyword})}*/}
            {/*    sortOptions={sortOptions}*/}
            {/*    onSortChange={handleSortChange}*/}
            {/*    actionButtonText={'Giao bài tập'}*/}
            {/*    onActionButtonClick={() => navigate(`/teacher/assignment/attach`,*/}
            {/*        {*/}
            {/*            state: {currentAssignment}*/}
            {/*        }*/}
            {/*    )*/}
            {/*    }*/}
            {/*/>*/}

            <CommonTable
                headers={Object.values(dataFields).map((field) => field.label)}
                fields={Object.values(dataFields).map((field) => field.value)}
                data={objectData}
                message={message}
                // renderActions={(row) => (
                //     <CommonActionDropdown
                //         isOpen={openDropdownId === row[dataFields.assignmentId.value]}
                //         onToggle={() => handleToggleDropdown(row[dataFields.assignmentId.value])}
                //         actions={AssignmentRowActions({
                //             page: AssignmentListPage,
                //             row: row,
                //             dataFields: dataFields,
                //             navigate: navigate,
                //             showModal: null
                //         })}
                //     />
                // )}
                leftAlignedColumns={[1, 2]}
                underlinedColumns={[1]}
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