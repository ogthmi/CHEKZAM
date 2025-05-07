import React from "react";
import {Pagination, Row, Col} from "react-bootstrap";
import {FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight} from "react-icons/fa";
import "../../../css/Pagination.css"

export const CommonPagination = ({pageNumber, totalPages, totalElements, setPageNumber}) => {
    if (totalPages === 0) return null;

    const pages = Array.from({length: totalPages}, (_, i) => i + 1);

    const handlePageClick = (page) => {
        if (page !== "...") setPageNumber(page);
    };

    const getPageRange = () => {
        const range = [];
        const visiblePages = 5;
        const sidePages = Math.floor(visiblePages / 2);

        let startPage = Math.max(1, pageNumber - sidePages);
        let endPage = Math.min(totalPages, pageNumber + sidePages);

        // Điều chỉnh nếu gần đầu hoặc cuối để luôn đủ 5 trang
        if (pageNumber <= 3) {
            startPage = 1;
            endPage = Math.min(totalPages, 5);
        } else if (pageNumber >= totalPages - 2) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - 4);
        }

        if (startPage > 1) {
            range.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }

        if (endPage < totalPages) {
            range.push("...");
        }

        return range;
    };


    return (
        <Row className="mt-3 mx-0 px-0">
            <Col className={"d-flex justify-content-center align-items-center flex-column flex-lg-row"}>
                <Pagination className="d-flex justify-content-center">
                    <Pagination.First
                        className="no-style"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(1)}
                    >
                        <FaAngleDoubleLeft/>
                    </Pagination.First>
                    <Pagination.Prev
                        className="no-style"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    >
                        <FaAngleLeft/>
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
                        className="no-style"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                    >
                        <FaAngleRight/>
                    </Pagination.Next>
                    <Pagination.Last
                        className="no-style"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(totalPages)}
                    >
                        <FaAngleDoubleRight/>
                    </Pagination.Last>

                </Pagination>

                <div className="ms-0 ms-lg-5 p-0 text-muted text-lg-end text-center">
                    <p>
                        Trang {pageNumber}/{totalPages} (Tổng: {totalElements} bản ghi)
                    </p>
                </div>
            </Col>
        </Row>
    );
};
