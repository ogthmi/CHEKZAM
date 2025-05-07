import React from "react";
import {Dropdown, Col} from "react-bootstrap";

export const CommonSortDropdown = ({setSortOrder, sortOptions = []}) => {
    return (
        <Dropdown className={""} onSelect={(eventKey) => setSortOrder(eventKey)}>
            <Dropdown.Toggle className={`w-100 text-center bg-white text-muted border border-muted`}>
                Sắp xếp
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100 border">
                {sortOptions.map((option, index) => (
                    <Dropdown.Item key={index} eventKey={option.value}>
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
