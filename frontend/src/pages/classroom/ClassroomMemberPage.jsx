import {Container, Row, Col} from "react-bootstrap";

import {SearchModalButton} from "../../components/button/SearchModalButton";
import {ConfirmModalButton} from "../../components/button/ConfirmModalButton";
import {SearchInput, SortDropdown, CustomTable, CustomPagination} from "../../components/common/ExportCommonComponent"
import {ClassroomInfoContext} from "../../components/context/ClassroomInfoContext"

import {useContext, useState} from "react";
import {usePaginatedData} from "../../hooks/data/usePaginatedData"

import {EntityTypes} from "../../constants/data/EntityTypes";
import {DataActions} from "../../constants/data/ActionMethods";

const dataFields = () => ({
    "Họ và tên": "fullName",
    "Giới tính": "gender",
    "Trường": "school",
    "Khoa/Lớp": "department",
    "Email": "email"
});

export const ClassroomMemberPage = () => {
    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "fullName",
        direction: "asc",
        keyword: ""
    });

    const [currentClassroom] = useContext(ClassroomInfoContext);
    const classroomId = currentClassroom?.classroomId;

    // Luôn gọi hook, nhưng hiển thị loading khi classroomId chưa có
    const {objectData, totalPages, message} = usePaginatedData(
        EntityTypes.classroom.STUDENT,
        classroomId,
        filters.pageNumber,
        filters.sortBy,
        filters.direction,
        filters.keyword
    );

    // Nếu classroomId chưa có, hiển thị thông báo đang tải dữ liệu lớp học
    if (!classroomId) {
        return (
            <p>"Đang tải dữ liệu lớp học..." </p>
        );
    }
    return (
        <Container>
            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}>
                    <SearchInput/>
                </Col>
                <Col lg={2}><SortDropdown/></Col>
                <Col lg={2}>
                    <SearchModalButton
                        entityType={EntityTypes.classroom.STUDENT}
                        content={"Thêm sinh viên"}
                        className="w-100"
                        mode={DataActions.APPEND}
                        containerId={classroomId}
                    />
                </Col>
            </Row>

            {/* Hiển thị bảng khi classroomId đã có */}
            <CustomTable
                headers={Object.keys(dataFields())}
                fields={Object.values(dataFields())}
                data={objectData}
                renderActions={(row) =>
                    <ConfirmModalButton
                        entityType={EntityTypes.classroom.STUDENT}
                        containerId={currentClassroom.classroomId}
                        itemIdToDelete={row.userId}
                        content="Xóa khỏi lớp"
                    />
                }
                leftAlignedColumns={[0, 1, 2, 3, 4]}
            />
        </Container>
    );
};
