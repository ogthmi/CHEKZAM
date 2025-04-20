import {useState, useCallback, useEffect} from "react";
import {Container, Row, Col} from "react-bootstrap";

import {ClassroomRenderAction, ClassroomRowRenderActions} from "../../components/classroom/ClassroomActions";
import {SearchInput, SortDropdown, CustomTable, CustomPagination} from "../../components/common/ExportCommonComponent"

import {useNavigate} from "react-router-dom";
import {usePaginatedData} from "../../hooks/data/usePaginatedData"

import {Endpoints} from "../../constants/links/Endpoints";
import {EntityTypes} from "../../constants/data/EntityTypes";
import {UserRoles} from "../../constants/data/UserRoles";
import {Cookies} from "../../constants/data/Cookies";

const dataFields = (mainRole) => ({
    "Mã lớp": "classroomId",
    "Tên lớp": "classroomName",
    ...(mainRole !== UserRoles.STUDENT.value && {"Thời gian tạo": "createdAt"}),
    "Sĩ số": "classroomStatistic.totalMembers",
    "Bài tập": "classroomStatistic.totalExercises",
    "Tài liệu": "classroomStatistic.totalDocuments"
});

const getSortOptions = (mainRole) => [
    {label: "A-Z", value: "az"},
    {label: "Z-A", value: "za"},
    {label: "Mã lớp tăng dần", value: "idasc"},
    {label: "Mã lớp giảm dần", value: "iddesc"},
    ...(mainRole !== UserRoles.STUDENT.value ? [
        {label: "Mới hơn", value: "newer"},
        {label: "Cũ hơn", value: "older"},
    ] : [])
];


export const ClassroomListPage = () => {
    const mainRole = Cookies.getCookie(Cookies.mainRole);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "classroomName",
        direction: "asc",
        keyword: ""
    });

    const {objectData, totalPages, message} = usePaginatedData(
        EntityTypes.classroom.INFO, null, filters.pageNumber, filters.sortBy, filters.direction, filters.keyword
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
            az: {sortBy: "classroomName", direction: "asc"},
            za: {sortBy: "classroomName", direction: "desc"},
            idasc: {sortBy: "classroomId", direction: "asc"},
            iddesc: {sortBy: "classroomId", direction: "desc"},
            newer: {sortBy: "createdAt", direction: "desc"},
            older: {sortBy: "createdAt", direction: "asc"}
        };

        updateFilters({...sortConfig[value], pageNumber: 1});
    }, []);

    return (
        <Container className="p-2 mt-3">
            <Row className="mt-3 mx-md-0 mx-2"><h5>Lớp học</h5></Row>

            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}><SearchInput setKeyword={(kw) => updateFilters({keyword: kw})}/></Col>
                <SortDropdown setSortOrder={handleSortChange} sortOptions={getSortOptions(mainRole)}/>
                <Col lg={2}><ClassroomRenderAction mainRole={mainRole}/></Col>
            </Row>

            <CustomTable
                headers={Object.keys(dataFields(mainRole))}
                fields={Object.values(dataFields(mainRole))}
                data={objectData}
                message={message}
                renderActions={(row) => <ClassroomRowRenderActions mainRole={mainRole} row={row}/>}
                leftAlignedColumns={[1]}
                excludedFields={mainRole === UserRoles.STUDENT.value ? ['createdAt'] : []}
                underlinedColumns={[1]}
                onRowClick={(row) => navigate(`${Endpoints.teacher.classroom}/${row.classroomId}/assignment`)}
            />


            <CustomPagination
                pageNumber={filters.pageNumber}
                totalPages={totalPages}
                setPageNumber={(pageNumber) => updateFilters({pageNumber})}
            />
        </Container>
    );
};
