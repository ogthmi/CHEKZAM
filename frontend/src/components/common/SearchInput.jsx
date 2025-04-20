import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import '../../css/shared-style.css';

export const SearchInput = ({ setKeyword, onSearch, placeholder = "Tìm kiếm theo tên", className = "" }) => {
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
        <Row>
            <Col lg={9} md={9}>
                <Form.Control
                    type="text"
                    placeholder={placeholder}
                    className={`text-lg-start text-center ${className}`}
                    value={inputValue} // Gán giá trị input
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Col>
            <Col lg={3} md={3}>
                <Button className="w-100 border border-muted mt-md-0 mt-2"
                    variant="light" onClick={handleSearch}>
                    Tìm kiếm
                </Button> 
            </Col>
        </Row>
    );
};
