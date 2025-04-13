const getValueByField = (obj, field) => {
    return field.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

export function useCustomTable({ data, headers, fields, leftAlignedColumns, excludedFields, onRowClick }) {
    const filteredHeaders = headers.filter(header => !excludedFields.includes(header));
    const filteredFields = fields.filter((field, index) => !excludedFields.includes(headers[index]));

    const getLeftAlignedColumns = (index) => (leftAlignedColumns.includes(index) ? "text-start" : "text-center");

    const handleRowClick = (dataRow, event) => {
        event.stopPropagation();
        if (document.querySelector(".modal")?.contains(event.target)) return;
        if (event.target.closest("button")) return;
        if (onRowClick) {
            onRowClick(dataRow);
        }
    };
    return {
        data,
        filteredHeaders,
        filteredFields,
        getLeftAlignedColumns,
        getValueByField,
        handleRowClick,
    };
}
