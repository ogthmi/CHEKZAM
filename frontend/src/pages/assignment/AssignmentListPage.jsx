import {useCallback, useEffect, useState} from "react";
import {usePaginatedData} from "../../hooks/data/usePaginatedData";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {Endpoints} from "../../constants/links/Endpoints";
import {Col, Container, Row} from "react-bootstrap";
import {SearchInput} from "../../components/common/SearchInput";
import {SortDropdown} from "../../components/common/SortDropdown";
import {CustomTable} from "../../components/common/CustomTable";
import {CustomPagination} from "../../components/common/CustomPagination";
import {LinkButton} from "../../components/button/LinkButton";
import {ConfirmModalButton} from "../../components/button/ConfirmModalButton";
import {useNavigate} from "react-router-dom";
import {Cookies} from "../../constants/data/Cookies";
import {UserRoles} from "../../constants/data/UserRoles";


const dataFields = {
    "Mã bài tập": "assignmentId",
    "Tên bài tập": "assignmentName",
    "Thời lượng (phút)": "duration",
    "Thời gian tạo": "createdAt",
    "Số câu hỏi": "totalQuestions",
    "Bắt đầu": "startTime",
    "Kết thúc": "endTime",
};

const getSortOptions = [
    {label: "A-Z", value: "az"},
    {label: "Z-A", value: "za"},
    {label: "ID tăng dần", value: "idasc"},
    {label: "ID giảm dần", value: "iddesc"},
    {label: "Mới hơn", value: "newer"},
    {label: "Cũ hơn", value: "older"},
];

export const AssignmentListPage = () => {
    const userCurrentRole = Cookies.getCookie(Cookies.mainRole)
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "assignmentName",
        direction: "asc",
        keyword: ""
    });

    const {objectData, totalPages, message} = usePaginatedData(
        EntityTypes.assignment.INFO, null, filters.pageNumber, filters.sortBy, filters.direction, filters.keyword
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
            az: {sortBy: "assignmentName", direction: "asc"},
            za: {sortBy: "assignmentName", direction: "desc"},
            idasc: {sortBy: "assignmentID", direction: "asc"},
            iddesc: {sortBy: "assignmentID", direction: "desc"},
            newer: {sortBy: "createdAt", direction: "desc"},
            older: {sortBy: "createdAt", direction: "asc"}
        };

        updateFilters({...sortConfig[value], pageNumber: 1});
    }, []);
    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3 mx-md-0 mx-2"><h5>Quản lý bài tập</h5></Row>

            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}><SearchInput setKeyword={(kw) => updateFilters({keyword: kw})}/></Col>
                <Col lg={2}><SortDropdown setSortOrder={handleSortChange} sortOptions={getSortOptions}/></Col>
                <Col lg={2}>
                    <LinkButton className="w-100" content={"Tạo bài tập"} reload={true} href={Endpoints.assignment.create(Cookies.getCookie(Cookies.mainRole).toLowerCase())}/>
                </Col>
            </Row>

            <CustomTable
                headers={Object.keys(dataFields)}
                fields={Object.values(dataFields)}
                data={objectData}
                message={message}
                renderActions={(row) => <>
                    <LinkButton content={"Chỉnh sửa"} size={"sm"} className={"me-md-1 me-0 mb-xl-0 mb-1"}/>
                    <ConfirmModalButton content={"Xóa"} size={"sm"} variant={"danger"}/>
                </>}
                leftAlignedColumns={[1]}
                underlinedColumns={[1]}
                onRowClick={(row) => {
                    const pathSuffix = userCurrentRole !== UserRoles.student.value ? 'detail' : 'history';
                    navigate(`${row.assignmentId}/${pathSuffix}`);
                }}
            />

            <CustomPagination
                pageNumber={filters.pageNumber}
                totalPages={totalPages}
                setPageNumber={(pageNumber) => updateFilters({pageNumber})}
            />
        </Container>
    );
}