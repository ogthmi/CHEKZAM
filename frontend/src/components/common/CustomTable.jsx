import React from "react";
import { Table } from "react-bootstrap";
import { useCustomTable } from "../../hooks/data/useCustomTable";
import { ERROR } from "../../constants/error";

export function CustomTable({
    headers,
    fields,
    data,
    message,
    renderActions,
    leftAlignedColumns = [],
    excludedFields = [],
    underlinedColumns = [],
    onRowClick,
}) {
    const {
        data: tableData,
        filteredHeaders,
        filteredFields,
        getLeftAlignedColumns,
        getValueByField,
        handleRowClick
    } = useCustomTable({ data, headers, fields, leftAlignedColumns, excludedFields, onRowClick });

    return (
        <Table className="mx-2 mt-3 table-hover align-middle">
            <thead className="bg-secondary text-white">
                <tr>
                    {filteredHeaders.map((header, index) => (
                        <th key={index} className={getLeftAlignedColumns(index)}>{header}</th>
                    ))}
                    {renderActions && <th className="text-center">Hành động</th>}
                </tr>
            </thead>
            <tbody>
                {tableData.length > 0 ? (
                    tableData.map((dataRow, rowIndex) => {
                        const isClickable = onRowClick; // Kiểm tra điều kiện click
                        return (
                            <tr
                                key={rowIndex}
                                onClick={isClickable ? (event) => handleRowClick(dataRow, event) : undefined}
                                style={{ cursor: isClickable ? "pointer" : "default" }}

                            >
                                {filteredFields.map((field, colIndex) => (
                                    <td key={colIndex} className={`py-3 ${getLeftAlignedColumns(colIndex)} ${underlinedColumns.includes(colIndex) ? 'underlined-column' : ''}`}>
                                        {getValueByField(dataRow, field) ?? "—"}
                                    </td>
                                ))}
                                {renderActions && <td className="text-center">{renderActions(dataRow)}</td>}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={filteredHeaders.length + (renderActions ? 1 : 0)} className="text-center">
                            {message || ERROR.DATA_EMPTY}
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
