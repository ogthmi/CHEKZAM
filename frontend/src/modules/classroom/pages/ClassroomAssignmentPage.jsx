import {Container} from "react-bootstrap";
import {CommonTable, CommonPagination,} from "../../../ui/components/CommonComponent";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {ClassroomInfoContext} from "../components/common/ClassroomInfoContext";
import {Cookies} from "../../../constants/data/Cookies";
import {UserRoles} from "../../../constants/data/UserRoles";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {ResponseDataFields} from "../../../constants/data/ResponseDataFields";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {ClassroomModalRenderer} from "../components/modal/ClassroomModalRenderer";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {ClassroomRowActions} from "../components/common/ClassroomRowActions";
import {Endpoints} from "../../../constants/links/Endpoints";
import {
    formatDateTimeToDisplay,
    formatDuration,
    formatMaxAttempts
} from "../../assignment/util/AssignmentDataFormatter";

export const ClassroomAssignmentPage = () => {
    const [classroomInfo] = useContext(ClassroomInfoContext);
    const classroomId = classroomInfo?.classroomId;
    const isTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);


    const dataFields = ResponseDataFields.AssignmentClassroom("classroom-assignment");


    const sortFieldKeys = {
        name: dataFields.assignmentName.value,
        ...(isTeacher && {id: dataFields.assignmentId.value}),
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
        entityType: EntityTypes.classroom.ASSIGNMENT,
        containerId: classroomId,
        itemId: null,
        defaultSortBy: dataFields.assignmentName.value,
        sortFieldKeys,
    });

    const displayedData = objectData.map(item => ({
        ...item,
        duration: formatDuration(item.duration),
        maxAttempts: formatMaxAttempts(item.maxAttempts),
        openTime: formatDateTimeToDisplay(item.openTime),
        dueTime: formatDateTimeToDisplay(item.dueTime),
    }));


    const handleRowClick = (row) => {
        const field = dataFields.assignmentId.value;
        if (isTeacher) navigate(`${row[field]}${Endpoints.assignment.content}`);
        else navigate(`${row[field]}${Endpoints.assignment.history}`);
    };

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };


    if (!classroomId) return <p>Đang tải...</p>;

    return (
        <Container className={"p-0"}>
            <CommonListToolbar
                placeHolder={"Tìm kiếm bài tập theo tên"}
                onSearch={(keyword) => updateQueryParams({keyword})}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                actionButtonText={isTeacher ? 'Giao bài tập' : null}
                onActionButtonClick={() => isTeacher && showModal(EntityTypes.classroom.ADD_ASSIGNMENT, { containerId: classroomId })}
            />

            <CommonTable
                headers={Object.values(dataFields).map((f) => f.label)}
                fields={Object.values(dataFields).map((f) => f.value)}
                data={displayedData}
                message={message}
                leftAlignedColumns={isTeacher ? [0, 1] : [0]}
                excludedFields={!isTeacher ? [dataFields.assignmentId.label] : []}
                underlinedColumns={[0]}
                onRowClick={handleRowClick}
                renderActions={(row) => (
                    <CommonActionDropdown
                        isOpen={openDropdownId === row[dataFields.assignmentId.value]}
                        onToggle={() => handleToggleDropdown(row[dataFields.assignmentId.value])}
                        actions={ClassroomRowActions({
                            page: ClassroomAssignmentPage,
                            isTeacher: isTeacher,
                            row: row,
                            dataFields: dataFields,
                            navigate: navigate,
                            currentClassroom: classroomInfo,
                            showModal: showModal
                        })}
                    />
                )}
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
};
