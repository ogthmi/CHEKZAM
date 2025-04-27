import {useState} from "react";

export const useSortDropdown = ({pageNumber, sortBy, direction, keyword}) => {
    const [filters, setFilters] = useState({
        pageNumber: 1,
        sortBy: "createdAt",
        direction: "desc",
        keyword: ""
    });
}