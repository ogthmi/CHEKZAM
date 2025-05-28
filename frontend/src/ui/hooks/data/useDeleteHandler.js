import { useCallback } from "react";
import { deleteData } from "../../../services/CRUDService";
import { toast } from "react-toastify";

export const useDeleteHandler = () => {
    const handleDelete = useCallback(
        async ({ entityType, containerId, itemId, onSuccess, onError }) => {
            const result = await deleteData(entityType, containerId, itemId);
            if (result?.success) {
                toast.success(result.message || "Xóa thành công");
                onSuccess?.(result);
                setTimeout(() => window.location.reload(), 3000);
            } else {
                toast.error(result.message || "Xóa thất bại");
                onError?.(result);
            }
        },
        []
    );

    return { handleDelete };
};
