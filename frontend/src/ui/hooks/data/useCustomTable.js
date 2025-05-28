import {UserRoles} from "../../../constants/data/UserRoles";
import {getUserRoleBadge} from "../../../modules/user/components/UserProfileNameCard";

const getValueByField = (dataRow, field) => {
    if (!field) return null;

    try {
        const parts = field.split(".").flatMap(part => {
            const match = part.match(/([^\[\]]+)|(\[\d+])/g);
            return match.map(p => p.startsWith("[") ? parseInt(p.slice(1, -1), 10) : p);
        });
        if (field === "roles[0]") {
            const roleValue = dataRow.roles[0];
            return getUserRoleBadge(roleValue);
        }
        return parts.reduce((acc, part) => (acc !== undefined && acc !== null ? acc[part] : undefined), dataRow);
    } catch (e) {
        return undefined;
    }
};


export function useCustomTable({data, headers, fields, leftAlignedColumns, excludedFields, onRowClick}) {
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
