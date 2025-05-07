import {Button, Col, Row} from "react-bootstrap";
import {CommonSearchInput} from "./CommonSearchInput";
import {CommonSortDropdown} from "./CommonSortDropdown";

export const CommonListToolbar = ({
                                      onSearch,
                                      sortOptions,
                                      onSortChange,
                                      actionButtonText,
                                      onActionButtonClick
                                  }) => {
    return (
        <div className="container">
            <Row className="p-0 mt-3">
                <Col lg={actionButtonText ? 8 : 10} className="px-0 pe-lg-2 mb-2 mb-lg-0">
                    <CommonSearchInput setKeyword={onSearch} />
                </Col>
                <Col lg={2} className="px-0 mb-2 mb-lg-0">
                    <CommonSortDropdown sortOptions={sortOptions} setSortOrder={onSortChange} />
                </Col>
                {actionButtonText && onActionButtonClick && (
                    <Col lg={2} className="px-0 ps-lg-2">
                        <Button className="w-100" onClick={onActionButtonClick}>
                            {actionButtonText}
                        </Button>
                    </Col>
                )}
            </Row>
        </div>

    );
};
