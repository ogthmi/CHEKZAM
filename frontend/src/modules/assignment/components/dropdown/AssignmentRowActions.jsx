import {AssignmentListPage} from "../../pages/AssignmentListPage";
import {Endpoints} from "../../../../constants/links/Endpoints";

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
            { label: "Chỉnh sửa"},
            { label: "Giao cho lớp học"},
            { label: "Xóa"},
        ]
    }

    return actions[page] || []
}