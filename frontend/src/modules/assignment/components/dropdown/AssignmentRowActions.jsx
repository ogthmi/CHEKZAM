import {AssignmentListPage} from "../../pages/AssignmentListPage";
import {Endpoints} from "../../../../constants/links/Endpoints";
import {EntityTypes} from "../../../../constants/data/EntityTypes";

export const AssignmentRowActions = ({
                                         page,
                                         row,
                                         dataFields,
                                         navigate = null,
                                         showModal = null
                                     }) => {
    const actions = {
        [AssignmentListPage]: [
            {
                label: "Xem chi tiết",
                onClick: () => navigate(`${row[dataFields.assignmentId.value]}${Endpoints.assignment.content}`),
            },
            {label: "Chỉnh sửa"},
            {label: "Giao cho lớp học"},
            {
                label: "Xóa",
                onClick: () => {
                    showModal(
                        EntityTypes.assignment.DELETE,
                        {
                            title: "Xác nhận xóa bài tập",
                            message: `Bạn có chắc muốn xóa bài tập "${row.assignmentName}" không?`,
                            containerId: null,
                            itemId: row.assignmentId,
                            entityType: EntityTypes.assignment.INFO,
                        }
                    );
                }
            },
        ]
    }

    return actions[page] || []
}