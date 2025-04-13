import { Row, Col } from "react-bootstrap";
import { FormActionButton } from "../button/FormActionButton";
import { SearchInput } from "../common/SearchInput";
import { SortDropdown } from "../common/SortDropdown";

export const ClassroomAssignmentPage = () => {

    return (
        <>
            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}>
                    <SearchInput />
                </Col>
                <Col lg={2}><SortDropdown /></Col>
                <Col lg={2}>
                    <FormActionButton
                        content={"Tạo bài tập"}
                        className="w-100"
                    />
                </Col>
            </Row>


        </>
    );
}