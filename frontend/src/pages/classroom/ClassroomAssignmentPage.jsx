import { Container, Row, Col } from "react-bootstrap";
import { FormModalButton } from "../../components/button/FormModalButton";
import { SearchInput, SortDropdown } from "../../components/common/ExportCommonComponent"

export const ClassroomAssignmentPage = () => {

    return (
        <Container>
            <Row className="mt-3 mx-md-0 mx-2">
                <Col lg={8}>
                    <SearchInput />
                </Col>
                <Col lg={2}><SortDropdown /></Col>
                <Col lg={2}>
                    <FormModalButton
                        content={"Tạo bài tập"}
                        className="w-100"
                    />
                </Col>
            </Row>


        </Container>
    );
}