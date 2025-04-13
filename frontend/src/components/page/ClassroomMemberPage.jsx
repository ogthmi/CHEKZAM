import { Row, Col } from "react-bootstrap";
import { FormActionButton } from "../button/FormActionButton";
import { SearchInput } from "../common/SearchInput";
import { SortDropdown } from "../common/SortDropdown";
import { CustomTable } from "../common/CustomTable";
import { useState } from "react";
import { FORM_TYPE } from "../../constants/data";
import { usePaginatedData } from "../../hooks/data/usePaginatedData";
import React from "react";
import { DeleteButton } from "../button/DeleteButton";
import {getClassroomId} from "../classroom/ClassroomDetailsHeader";
import {useLocation} from "react-router-dom";

const dataFields = () => ({
    "Họ và tên": "fullName",
    "Giới tính": "gender",
    "Trường": "school",
    "Khoa/Lớp": "department",
    "Email": "email"
});


export const ClassroomMemberPage = () => {
    const location = useLocation();
    const currentClassroomId = getClassroomId(location.pathname)
    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "fullName",
        direction: "asc",
        keyword: ""
    });

    const { objectData, totalPages, message } = usePaginatedData(
        FORM_TYPE.classroom.classroomMember, currentClassroomId, filters.pageNumber, filters.sortBy, filters.direction, filters.keyword
    );
    console.log(objectData)
    return (
        <>
            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}>
                    <SearchInput />
                </Col>
                <Col lg={2}><SortDropdown /></Col>
                <Col lg={2}>
                    <FormActionButton
                        content={"Thêm sinh viên"}
                        className="w-100"
                    />
                </Col>
            </Row>

            <CustomTable
                headers={Object.keys(dataFields())}
                fields={Object.values(dataFields())}
                data={objectData}
                renderActions={(row) =>
                    <DeleteButton
                        formType={FORM_TYPE.classroom.classroomMember}
                        itemIdToDelete={row.userId}
                        content="Xóa khỏi lớp"
                    />
                }
                leftAlignedColumns={[0, 1, 2, 3, 4]}
            />
        </>
    );
}