import React from "react";
import { Pagination, Row, Col } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export const CustomPagination = ({ pageNumber, totalPages, setPageNumber }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (page) => {
        if (page !== "...") setPageNumber(page);
    };
    

    const getPageRange = () => {
        const visiblePages = 3;
        if (totalPages <= visiblePages * 2 + 1) return pages;

        const range = [];
        if (pageNumber <= visiblePages + 1) {
            range.push(...pages.slice(0, visiblePages * 2), "...", totalPages);
        } else if (pageNumber >= totalPages - visiblePages) {
            range.push(1, "...", ...pages.slice(-visiblePages * 2));
        } else {
            range.push(1, "...", ...pages.slice(pageNumber - 2, pageNumber + 1), "...", totalPages);
        }
        return range;
    };

    return (
        <Row className="mt-3">
            <Col>
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev
                            disabled={pageNumber === 1}
                            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        >
                            <FaAngleLeft />
                        </Pagination.Prev>

                        {getPageRange().map((page, index) => (
                            <Pagination.Item
                                key={index}
                                onClick={() => handlePageClick(page)}
                                active={page === pageNumber}
                                disabled={page === "..."}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            disabled={pageNumber === totalPages}
                            onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                        >
                            <FaAngleRight />
                        </Pagination.Next>
                        
                    </Pagination>
                </div>
            </Col>
        </Row>
    );
};
