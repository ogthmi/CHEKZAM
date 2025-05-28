import {useCallback, useMemo} from "react";

/**
 * Hook quản lý toàn bộ logic sort: option + handler + initial sort
 * @param {object} params
 * @param {object} params.fieldKeys - { name, id, createdAt }
 * @param {function} params.updateFilters - Hàm setQueryParams
 * @param {string} params.defaultKey - sort key mặc định (az, iddesc, ...)
 */
export const useSort = ({fieldKeys, updateFilters, defaultKey = "az"}) => {
    // Kiểm tra nếu fieldKeys chứa name và id (cần thiết) và createdAt (tùy chọn)
    const sortMap = useMemo(() => {
        if (!fieldKeys) {
            console.warn("Missing fieldKeys or essential fields: name or id");
            return {}; // Trả về đối tượng rỗng nếu thiếu các trường bắt buộc
        }

        const base = {};

        if (fieldKeys.name){
            base.az = {sortBy: fieldKeys.name, direction: "asc", label: "A-Z"};
            base.za = {sortBy: fieldKeys.name, direction: "desc", label: "Z-A"};
        }

        if (fieldKeys.id) {
            base.idasc = {sortBy: fieldKeys.id, direction: "asc", label: "ID tăng dần"};
            base.iddesc = {sortBy: fieldKeys.id, direction: "desc", label: "ID giảm dần"};
        }
        if (fieldKeys.createdAt) {
            base.newer = {sortBy: fieldKeys.createdAt, direction: "desc", label: "Mới hơn"};
            base.older = {sortBy: fieldKeys.createdAt, direction: "asc", label: "Cũ hơn"};
        }

        if (fieldKeys.role) {
            base.role = {sortBy: fieldKeys.role, direction: "asc", label: "Chức vụ"};
        }

        return base;
    }, [fieldKeys]);

    const handleSortChange = useCallback((selectedKey) => {
        const selectedSort = sortMap[selectedKey];
        if (selectedSort) {
            updateFilters({sortBy: selectedSort.sortBy, direction: selectedSort.direction, pageNumber: 1});
        } else {
            console.warn("Invalid sort key:", selectedKey);
        }
    }, [sortMap, updateFilters]);

    const sortOptions = useMemo(() => {
        if (Object.keys(sortMap).length === 0) {
            console.warn("sortMap is empty");
            return []; // Trả về mảng rỗng nếu sortMap là rỗng
        }

        return Object.entries(sortMap).map(([key, val]) => ({
            label: val.label,
            value: key
        }));
    }, [sortMap]);

    const initialSort = useMemo(() => {
        return sortMap[defaultKey] || Object.values(sortMap)[0];
    }, [defaultKey, sortMap]);

    return {
        sortOptions,
        handleSortChange,
        initialSort
    };
};
