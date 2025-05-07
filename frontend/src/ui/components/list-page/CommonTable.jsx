import React from "react";
import {Table} from "react-bootstrap";
import {useCustomTable} from "../../hooks/data/useCustomTable";
import {ErrorMessages} from "../../../constants/messages/ErrorMessages";

export function CommonTable({
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
        filteredHeaders = null,
        filteredFields= null,
        getLeftAlignedColumns,
        getValueByField,
        handleRowClick
    } = useCustomTable({data, headers, fields, leftAlignedColumns, excludedFields, onRowClick});
    return (
        <Table className="mt-3 table-hover align-middle">
            <thead className="bg-secondary text-white">
            <tr>
                {filteredHeaders.map((header, index) => (
                    <th key={index} className={getLeftAlignedColumns(index)}>{header}</th>
                ))}
                {renderActions && <th className="text-center"></th>}
            </tr>
            </thead>
            <tbody>
            {tableData.length > 0 ? (
                tableData.map((dataRow, rowIndex) => {
                    const isClickable = onRowClick;
                    return (
                        <tr
                            key={rowIndex}
                            onClick={isClickable ? (event) => handleRowClick(dataRow, event) : undefined}
                            style={{cursor: isClickable ? "pointer" : "default"}}

                        >
                            {filteredFields.map((field, colIndex) => (
                                <td key={colIndex}
                                    className={`py-3 ${getLeftAlignedColumns(colIndex)} ${underlinedColumns.includes(colIndex) ? 'underlined-column' : ''}`}>
                                    {getValueByField(dataRow, field) ?? "—"}
                                </td>
                            ))}
                            {renderActions  && <td className="text-center p-2">{renderActions(dataRow)}</td>}
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td colSpan={filteredHeaders.length + (renderActions ? 1 : 0)} className="text-center">
                        {message || ErrorMessages.DATA_EMPTY}
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
    );
}
