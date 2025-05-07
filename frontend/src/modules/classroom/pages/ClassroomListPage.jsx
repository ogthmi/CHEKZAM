import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import {CommonTable, CommonPagination} from "../../../ui/components/CommonComponent";
import {CommonListToolbar} from "../../../ui/components/list-page/CommonListToolbar";
import {EntityTypes} from "../../../constants/data/EntityTypes";
import {UserRoles} from "../../../constants/data/UserRoles";
import {Cookies} from "../../../constants/data/Cookies";
import {Endpoints} from "../../../constants/links/Endpoints";
import {ResponseDataFields} from "../../../constants/data/ResponseDataFields";
import {CommonModalContext} from "../../../ui/components/modal/CommonModalContext";
import {usePaginatedTable} from "../../../ui/hooks/pagination/usePaginatedTable";
import {CommonActionDropdown} from "../../../ui/components/dropdown/CommonActionDropdown";
import {ClassroomRowActions} from "../components/common/ClassroomRowActions";
import {ClassroomModalRenderer} from "../components/modal/ClassroomModalRenderer";

export const ClassroomListPage = () => {
    const isTeacher = Cookies.getCookie(Cookies.mainRole) === UserRoles.teacher.value;
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);

    const dataFields = ResponseDataFields.ClassroomInfo(isTeacher);

    const sortFieldKeys = {
        name: "classroomName",
        id: "classroomId",
        createdAt: isTeacher ? "createdAt" : undefined
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
        entityType: EntityTypes.classroom.INFO,
        containerId: null,
        defaultSortBy: dataFields.classroomName.value,
        sortFieldKeys,
    });

    const handleRowClick = (row) => {
        const field = dataFields.classroomId.value;
        setOpenDropdownId(null);
        navigate(`${row[field]}${Endpoints.assignment.domain}`);
    };

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3"><h5>Lớp học của tôi</h5></Row>

            <CommonListToolbar
                onSearch={(keyword) => updateQueryParams({keyword})}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                actionButtonText={isTeacher ? 'Tạo lớp học' : 'Tham gia lớp học'}
                onActionButtonClick={() => showModal(isTeacher ? EntityTypes.classroom.INFO : EntityTypes.classroom.JOIN)}
            />


            <CommonTable
                headers={Object.values(dataFields).map((field) => field.label)}
                fields={Object.values(dataFields).map((field) => field.value)}
                data={objectData}
                message={message}
                renderActions={(row) => (
                    <CommonActionDropdown
                        isOpen={openDropdownId === row[dataFields.classroomId.value]}
                        onToggle={() => handleToggleDropdown(row[dataFields.classroomId.value])}
                        actions={ClassroomRowActions({
                            page: ClassroomListPage,
                            isTeacher: isTeacher,
                            row: row,
                            dataFields: dataFields,
                            navigate: navigate,
                            showModal: showModal
                        })}
                    />
                )}
                leftAlignedColumns={[1]}
                excludedFields={isTeacher ? ['createdAt'] : undefined}
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
};
