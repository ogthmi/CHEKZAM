import {Container, Row, Col, Button} from "react-bootstrap";
import {
    CommonSearchInput,
    CommonSortDropdown,
    CommonTable,
    CommonPagination,
} from "../../../ui/components/CommonComponent";

import {useContext, useState} from "react";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {ClassroomInfoContext} from "../components/common/ClassroomInfoContext";
import {UserRoles} from "../../../constants/data/UserRoles";
import {Cookies} from "../../../constants/data/Cookies";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {ResponseDataFields} from "../../../constants/data/ResponseDataFields";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {ClassroomModalRenderer} from "../components/modal/ClassroomModalRenderer";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {ClassroomRowActions} from "../components/common/ClassroomRowActions";

export const ClassroomMemberPage = () => {
    const [classroomInfo] = useContext(ClassroomInfoContext);
    const classroomId = classroomInfo?.classroomId;

    const isTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;

    const dataFields = ResponseDataFields.UserInfo(false);

    const sortFieldKeys = {
        name: "fullName",
    };

    const {
        queryParams,
        updateQueryParams,
        sortOptions,
        handleSortChange,
        objectData,
        totalPages,
        totalElements,
        message,
    } = usePaginatedTable({
        entityType: EntityTypes.classroom.ADD_STUDENT,
        containerId: classroomId,
        defaultSortBy: "fullName",
        sortFieldKeys,
    });

    const {showModal} = useContext(CommonModalContext);

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    if (!classroomId) return <p>Đang tải dữ liệu lớp học...</p>;

    return (
        <Container className={"p-0"}>
            <CommonListToolbar
                onSearch={(keyword) => updateQueryParams({ keyword })}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                actionButtonText={isTeacher ? 'Thêm sinh viên' : null}
                onActionButtonClick={() =>
                    isTeacher && showModal(EntityTypes.classroom.ADD_STUDENT, { containerId: classroomId })
                }
            />

            <CommonTable
                headers={Object.values(dataFields).map((f) => f.label)}
                fields={Object.values(dataFields).map((f) => f.value)}
                data={objectData}
                message={message}
                leftAlignedColumns={[0, 1, 3, 4, 5]}
                excludedFields={[dataFields.userId.label]}
                renderActions={
                    isTeacher
                        ? (row) => (
                            <CommonActionDropdown
                                isOpen={openDropdownId === row[dataFields.userId.value]}
                                onToggle={() => handleToggleDropdown(row[dataFields.userId.value])}
                                actions={ClassroomRowActions({
                                    page: ClassroomMemberPage,
                                    isTeacher: isTeacher,
                                    currentClassroom: classroomInfo,
                                    row: row,
                                    dataFields: dataFields,
                                    showModal: showModal
                                })}
                            />
                        )
                        : undefined
                }
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
