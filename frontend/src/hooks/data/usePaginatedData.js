import { useState, useEffect, useCallback } from "react";
import { getPaginatedData } from "../../services/paginatedDataService";
import { ERROR } from "../../constants/error";

const DEFAULT_PAGE_SIZE = 10;

export function usePaginatedData(object, containerId, pageNumber, sortBy, direction, keyword = "") {
    const [objectData, setObjectData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await getPaginatedData(object, containerId, pageNumber, DEFAULT_PAGE_SIZE, sortBy, direction, keyword);
            setObjectData(response.objectContents);
            setTotalPages(response.totalPages);

        } catch (error) {
            setMessage(ERROR.FETCH_FAILED);
        }
    }, [object, pageNumber, sortBy, direction, keyword]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        objectData,
        totalPages,
        message,
    };
}
