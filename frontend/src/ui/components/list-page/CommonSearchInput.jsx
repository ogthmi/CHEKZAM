import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

export const CommonSearchInput = ({ setKeyword, onSearch, placeholder = "Tìm kiếm theo tên", className = "" }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = () => {
        if (setKeyword) {
            setKeyword(inputValue);
        }
        if (onSearch) {
            onSearch(inputValue);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    return (
        <Row className="gx-0 gy-2">
            <Col lg={9} className="pe-lg-2">
                <Form.Control
                    type="text"
                    placeholder={placeholder}
                    className={`text-lg-start text-center ${className}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Col>
            <Col lg={3}>
                <Button className="w-100" variant="secondary" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </Col>
        </Row>

    );
};
