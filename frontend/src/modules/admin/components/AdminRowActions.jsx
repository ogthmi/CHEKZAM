import {AdminUserManagementPage} from "../AdminUserManagementPage";

export const AdminRowActions = ({
                                    page,
                                    row,
                                    dataFields,
                                    navigate = null,
                                    showModal = null
                                }) => {
    const actions = {
        [AdminUserManagementPage]: [
            {
                label: "Xem chi tiết",
                onClick: () => navigate(`/user/${row.userId}`),
            },
            { label: "Xóa"},
        ]
    }

    return actions[page] || []
}