import {Col, Container, Row} from "react-bootstrap";
import {CommonPagination} from "../../ui/components/list-page/CommonPagination";
import {CommonListToolbar} from "../../ui/components/list-page/CommonListToolbar";
import {CommonTable} from "../../ui/components/list-page/CommonTable";
import {useContext, useEffect, useState} from "react";
import {AdminRowActions} from "./components/AdminRowActions";
import {CommonActionDropdown} from "../../ui/components/dropdown/CommonActionDropdown";
import {usePaginatedTable} from "../../ui/hooks/pagination/usePaginatedTable";
import {useNavigate} from "react-router-dom";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {ResponseDataFields} from "../../constants/data/ResponseDataFields";
import {CommonModalContext} from "../../ui/components/modal/CommonModalContext";
import {AdminModalRenderer} from "./components/AdminModalRenderer";
import {getData} from "../../services/CRUDService";

export function AdminUserManagementPage() {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState();
    const {showModal} = useContext(CommonModalContext);

    const dataFields = ResponseDataFields.UserInfo(true);

    const sortFieldKeys = {
        name: "fullName",
        id: dataFields.userId.value,
        role: dataFields.role.value,
        createdAt: dataFields.createdAt.value,
    };

    useEffect(() => {
        const getUserCount = async () => {
            const response = await getData(EntityTypes.user.COUNT, null, null);
            if (response) {
                setUserCount(response);
            }
        }
        getUserCount()
    }, []);

    console.log(userCount)

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
        defaultSortBy: dataFields.role.value,
        sortFieldKeys,
    });


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
            <Row className="mt-3">
                <h5 className={""}>Thống kê số lượng người dùng</h5>
                <Col className={"d-lg-flex d-inline-grid align-items-center flex-wrap my-3"}>
                    <div className={"box me-5"}>
                        <p className={"m-0"}>Tổng số người dùng</p>
                        <p className={"fs-1 fw-medium m-0"}>{userCount?.totalUsers}</p>
                    </div>
                    <div className={"box me-5"}>
                        <p className={"m-0"}>Quản trị viên</p>
                        <p className={"fs-1 fw-medium m-0"}>{userCount?.admin}</p>
                    </div>
                    <div className={"box me-5"}>
                        <p className={"m-0"}>Giáo viên</p>
                        <p className={"fs-1 fw-medium m-0"}>{userCount?.teacher}</p>
                    </div>
                    <div className={"box me-5"}>
                        <p className={"m-0"}>Sinh viên</p>
                        <p className={"fs-1 fw-medium m-0"}>{userCount?.student}</p>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3"><h5 className={""}>Thông tin người dùng</h5></Row>

            <CommonListToolbar
                placeHolder={"Tìm kiếm theo họ tên"}
                onSearch={(keyword) => updateQueryParams({keyword})}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                actionButtonText={'Tạo người dùng'}
                onActionButtonClick={() => {
                    showModal(EntityTypes.user.CREATE)
                }}
            />

            <CommonTable
                headers={Object.values(dataFields).map((field) => field.label)}
                fields={Object.values(dataFields).map((field) => field.value)}
                data={objectData}
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
                            showModal: showModal
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
            <AdminModalRenderer/>
        </Container>
    )
}