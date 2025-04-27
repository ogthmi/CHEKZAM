import {Col, Container, Row} from "react-bootstrap";
import {SearchInput} from "../../components/common/SearchInput";
import {SortDropdown} from "../../components/common/SortDropdown";
import {FormModalButton} from "../../components/button/FormModalButton";
import {useCallback, useEffect, useState} from "react";
import {usePaginatedData} from "../../hooks/data/usePaginatedData";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {CustomTable} from "../../components/common/CustomTable";

import {CustomPagination} from "../../components/common/CustomPagination";
import {ConfirmModalButton} from "../../components/button/ConfirmModalButton";

const dataFields = {
    "Mã người dùng": "userId",
    "Tài khoản": "username",
    "Họ đệm": "lastName",
    "Tên": "firstName",
    "Ngày sinh": "birthdate",
    "Chức vụ chính": "roles[0]",
    "Email": "email",
    "Thời gian tạo": "createdAt",
};

const getSortOptions = () => [
    {label: "A-Z", value: "az"},
    {label: "Z-A", value: "za"},
    {label: "Mã tăng dần", value: "idasc"},
    {label: "Mã giảm dần", value: "iddesc"},
    {label: "Mới hơn", value: "newer"},
    {label: "Cũ hơn", value: "older"},
];

export function AdminUserManagementPage() {
    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "createdAt",
        direction: "desc",
        keyword: ""
    });

    const {objectData, totalPages, message} = usePaginatedData(
        EntityTypes.user.INFO, null, filters.pageNumber, filters.sortBy, filters.direction, filters.keyword
    );

    useEffect(() => {
        setFilters(prev => ({...prev, pageNumber: 1}));
    }, [filters.keyword]);

    useEffect(() => {
    }, [filters.pageNumber]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    };

    const handleSortChange = useCallback((value) => {
        const sortConfig = {
            az: {sortBy: "firstName", direction: "asc"},
            za: {sortBy: "firstName", direction: "desc"},
            idasc: {sortBy: "userId", direction: "asc"},
            iddesc: {sortBy: "userId", direction: "desc"},
            newer: {sortBy: "createdAt", direction: "desc"},
            older: {sortBy: "createdAt", direction: "asc"}
        };

        updateFilters({...sortConfig[value], pageNumber: 1});
    }, []);
    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3 mx-md-0 mx-2"><h5>Quản lý người dùng</h5></Row>

            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}><SearchInput setKeyword={(kw) => updateFilters({keyword: kw})}/></Col>
                <SortDropdown setSortOrder={handleSortChange} sortOptions={getSortOptions()}/>
                <Col lg={2}>
                    <FormModalButton
                        className={"w-100"}
                        content={"Tạo tài khoản"}
                    />
                </Col>

                <CustomTable
                    headers={Object.keys(dataFields)}
                    fields={Object.values(dataFields)}
                    data={objectData}
                    message={message}
                    renderActions={(row) => <ConfirmModalButton content={"Xóa"} containerId={row.id}/>}
                    leftAlignedColumns={[1, 2, 3]}
                    underlinedColumns={[1]}
                    // onRowClick={(row) => navigate(`${Endpoints.teacher.classroom}/${row.classroomId}/assignment`)}
                />

                <CustomPagination
                    pageNumber={filters.pageNumber}
                    totalPages={totalPages}
                    setPageNumber={(pageNumber) => updateFilters({pageNumber})}
                />
            </Row>
        </Container>
    )
}