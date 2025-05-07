import { useEffect } from "react";
import { usePaginatedData } from "./usePaginatedData";
import { useQueryParams } from "./useQueryParams";
import { useSort } from "./useSort";

export const usePaginatedTable = ({
                                      entityType,
                                      containerId,
                                      defaultSortBy = null,
                                      sortFieldKeys = null,
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

    useEffect(() => {
        if (queryParams.pageNumber !== 1) {
            updateQueryParams({ pageNumber: 1, keyword: queryParams.keyword });
        }
    }, [queryParams.keyword]);

    useEffect(() => {
        if (!queryParams.sortBy || !queryParams.direction) {
            updateQueryParams({ ...initialSort });
        }
    }, [queryParams.sortBy, queryParams.direction, initialSort, updateQueryParams]);  // Thêm các dependencies


    // console.log(containerId)
    const { objectData, totalPages, totalElements, message } = usePaginatedData(
        entityType,
        containerId,
        queryParams.pageNumber,
        queryParams.sortBy,
        queryParams.direction,
        queryParams.keyword
    );

    return {
        queryParams,
        updateQueryParams,
        sortOptions,
        handleSortChange,
        objectData,
        totalPages,
        totalElements,
        message,
    };
};
