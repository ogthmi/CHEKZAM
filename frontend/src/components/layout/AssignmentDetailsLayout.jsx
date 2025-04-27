import {Container} from "react-bootstrap";
import {AllPagesLayout} from "./AllPagesLayout"
import {CustomHorizontalTab} from "../common/CustomHorizontalTab";
import {useParams, useLocation} from "react-router-dom";
import {Outlet} from "react-router-dom";
import {AssignmentInfoHeader} from "../header/AssignmentInfoHeader";

function AssignmentHorizontalTab({isInClassroomAssignment = false}) {
    const {userRole, assignmentId, classroomId} = useParams();

    let basePath;
    if (isInClassroomAssignment) {
        basePath = `/${userRole}/classroom/${classroomId}/assignment/${assignmentId}`;
    } else basePath = `/${userRole}/assignment/${assignmentId}`;
    const tabs = [
        {key: "detail", label: "Chi tiết", path: "detail"},
        (!isInClassroomAssignment ? {key: "classroom", label: "Lớp học đã gán", path: "assigned-classroom"} : null),
        {key: "history", label: "Lịch sử", path: "history"},
    ];

    return <CustomHorizontalTab tabs={tabs} basePath={basePath}/>;
}

export const AssignmentDetailsLayout = () => {
    return (
        <AllPagesLayout>
            <Container className="p-2 mt-3">
                <AssignmentInfoHeader/>
                <AssignmentHorizontalTab/>
                <Outlet/>
            </Container>
        </AllPagesLayout>
    );
}