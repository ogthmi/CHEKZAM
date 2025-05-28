import { useEffect, useRef } from "react";
import { usePaginatedData } from "./usePaginatedData";
import { useQueryParams } from "./useQueryParams";
import { useSort } from "./useSort";

export const usePaginatedTable = ({
                                      entityType,
                                      containerId,
                                      itemId = null,
                                      defaultSortBy = null,
                                      sortFieldKeys = null,
                                      infiniteScroll = false, // ✅ Thêm cờ
                                  }) => {
    const [queryParams, updateQueryParams] = useQueryParams({
        pageNumber: 1,
        keyword: "",
        sortBy: defaultSortBy,
        direction: "asc",
    });

    const { sortOptions, handleSortChange, initialSort } = useSort({
        fieldKeys: sortFieldKeys,
        updateFilters: updateQueryParams,
        defaultKey: "az",
    });

    // Reset page về 1 khi tìm kiếm
    useEffect(() => {
        if (queryParams.pageNumber !== 1) {
            updateQueryParams({ pageNumber: 1, keyword: queryParams.keyword });
        }
    }, [queryParams.keyword]);

    // Khởi tạo sort nếu thiếu
    useEffect(() => {
        if (!queryParams.sortBy || !queryParams.direction) {
            updateQueryParams({ ...initialSort });
        }
    }, [queryParams.sortBy, queryParams.direction, initialSort, updateQueryParams]);

    // Gọi API dữ liệu
    const { objectData, totalPages, totalElements, message, setObjectData } = usePaginatedData({
        entityType,
        containerId,
        itemId,
        pageNumber: queryParams.pageNumber,
        sortBy: queryParams.sortBy,
        direction: queryParams.direction,
        keyword: queryParams.keyword,
        infiniteScroll,
    });

    const observerRef = useRef(null);

    useEffect(() => {
        if (!infiniteScroll) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && queryParams.pageNumber < totalPages) {
                    updateQueryParams({ pageNumber: queryParams.pageNumber + 1 });
                }
            },
            { threshold: 1.0 }
        );

        const ref = observerRef.current;
        if (ref) observer.observe(ref);

        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, [infiniteScroll, queryParams.pageNumber, totalPages]);

    return {
        queryParams,
        updateQueryParams,
        sortOptions,
        handleSortChange,
        objectData,
        totalPages,
        totalElements,
        message,
        observerRef,
    };
};
