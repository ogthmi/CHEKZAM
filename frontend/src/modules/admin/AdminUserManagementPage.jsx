import {Container, Row} from "react-bootstrap";
import {CommonPagination} from "../../ui/components/list-page/CommonPagination";
import {CommonListToolbar} from "../../ui/components/list-page/CommonListToolbar";
import {CommonTable} from "../../ui/components/list-page/CommonTable";
import {useContext, useState} from "react";
import {AdminRowActions} from "./components/AdminRowActions";
import {CommonActionDropdown} from "../../ui/components/dropdown/CommonActionDropdown";
import {usePaginatedTable} from "../../ui/hooks/pagination/usePaginatedTable";
import {useNavigate} from "react-router-dom";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {ResponseDataFields} from "../../constants/data/ResponseDataFields";
import {CommonModalContext} from "../../ui/components/modal/CommonModalContext";

export function AdminUserManagementPage() {
    const navigate = useNavigate();
    const {showModal} = useContext(CommonModalContext);

    const dataFields = ResponseDataFields.UserInfo(true);

    const sortFieldKeys = {
        name: "fullName",
        id: dataFields.userId.value,
        createdAt: dataFields.createdAt.value,
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
        entityType: EntityTypes.user.PROFILE,
        containerId: null,
        defaultSortBy: "fullName",
        sortFieldKeys,
    });

    const cleanedObjectData = objectData.map(user => ({
        ...user,
    }))

    const handleRowClick = (row) => {
        const field = dataFields.userId.value;
        setOpenDropdownId(null);
        navigate(`/user/${row[field]}`);
    };

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const handleToggleDropdown = (id) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3 mx-md-0 mx-2"><h5>Quản lý người dùng</h5></Row>

            <Row className="mt-3 mx-md-0 mx-2">
                <CommonListToolbar
                    onSearch={(keyword) => updateQueryParams({keyword})}
                    sortOptions={sortOptions}
                    onSortChange={handleSortChange}
                    actionButtonText={'Tạo người dùng mới'}
                    onActionButtonClick={() => {
                        console.log("đang chờ")}}
                />

                <CommonTable
                    headers={Object.values(dataFields).map((field) => field.label)}
                    fields={Object.values(dataFields).map((field) => field.value)}
                    data={cleanedObjectData}
                    message={message}
                    renderActions={(row) => (
                        <CommonActionDropdown
                            isOpen={openDropdownId === row[dataFields.userId.value]}
                            onToggle={() => handleToggleDropdown(row[dataFields.userId.value])}
                            actions={AdminRowActions({
                                page: AdminUserManagementPage,
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
            </Row>
        </Container>
    )
}