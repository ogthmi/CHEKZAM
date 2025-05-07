import React from "react";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

export const CommonActionDropdown = ({ actions, isOpen, onToggle }) => {
    return (
        <Dropdown align="end" show={isOpen} onToggle={onToggle}>
            <Dropdown.Toggle
                variant="link"
                className="p-0 text-dark no-caret-toggle"
                id="dropdown-toggle"
            >
                <BsThreeDotsVertical size={18} />
            </Dropdown.Toggle>

            <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
                {actions.map((action, index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                    >
                        {action.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
