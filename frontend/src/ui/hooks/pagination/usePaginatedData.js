import { useState, useEffect, useCallback } from "react";
import { getPaginatedData } from "../../../services/PaginatedDataService";
import { ErrorMessages } from "../../../constants/messages/ErrorMessages";

const DEFAULT_PAGE_SIZE = 10;

export function usePaginatedData({
                                     entityType,
                                     containerId,
                                     itemId = null,
                                     pageNumber,
                                     sortBy,
                                     direction,
                                     keyword = "",
                                     infiniteScroll = false, // ✅ Thêm cờ
                                 }) {
    const [objectData, setObjectData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [message, setMessage] = useState(null);

    const fetchData = useCallback(async () => {
        setMessage("Đang tải...");
        if (typeof containerId === "undefined") return;

        try {
            const response = await getPaginatedData({
                entityType,
                containerId,
                itemId,
                pageNumber,
                pageSize: 10,
                sortBy,
                direction,
                keyword,
            });

            // ✅ Nếu infiniteScroll thì nối dữ liệu
            setObjectData((prev) =>
                infiniteScroll && pageNumber > 1
                    ? [...prev, ...response.objectContents]
                    : response.objectContents
            );

            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setMessage(null);
        } catch (error) {
            setMessage("Không thể tải dữ liệu");
        }
    }, [entityType, containerId, itemId, pageNumber, sortBy, direction, keyword, infiniteScroll]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        objectData,
        totalPages,
        totalElements,
        message,
        setObjectData, // ✅ Trả ra để nếu cần reset từ bên ngoài
    };
}

