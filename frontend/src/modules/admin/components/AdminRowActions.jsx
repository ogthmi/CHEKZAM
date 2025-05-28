import {AdminUserManagementPage} from "../AdminUserManagementPage";
import {EntityTypes} from "../../../constants/data/EntityTypes";

export const AdminRowActions = ({
                                    page,
                                    row,
                                    dataFields,
                                    navigate = null,
                                    showModal
                                }) => {
    const actions = {
        [AdminUserManagementPage]: [
            {
                label: "Xem chi tiết",
                onClick: () => navigate(`/user/${row.userId}`),
            },
            {
                label: "Xóa",
                onClick: () => {
                    showModal(EntityTypes.user.DELETE, {
                        title: "Xác nhận xóa người dùng",
                        message: `Bạn có chắc muốn xóa người dùng "${row.lastName} ${row.firstName}" không?`,
                        containerId: null,
                        itemId: row.userId,
                    })
                },
            },
        ]
    }

    return actions[page] || []
}