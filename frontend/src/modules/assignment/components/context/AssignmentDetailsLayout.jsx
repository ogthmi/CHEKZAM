import {Container} from "react-bootstrap";
import {CommonAppLayout} from "../../../../ui/components/layout/CommonAppLayout"
import {CommonHorizontalTab} from "../../../../ui/components/layout/CommonHorizontalTab";
import {useParams, useLocation} from "react-router-dom";
import {Outlet} from "react-router-dom";
import {AssignmentInfoHeader} from "./AssignmentInfoHeader";

function AssignmentHorizontalTab({isInClassroomAssignment = false}) {
    const {userRole, assignmentId, classroomId} = useParams();

    let basePath;
    if (isInClassroomAssignment) {
        basePath = `/${userRole}/classroom/${classroomId}/assignment/${assignmentId}`;
    } else basePath = `/${userRole}/assignment/${assignmentId}`;
    const tabs = [
        {key: "content", label: "Chi tiết", path: "content"},
        (!isInClassroomAssignment ? {key: "classroom", label: "Lớp học đã gán", path: "assigned-classroom"} : null),
        {key: "history", label: "Lịch sử", path: "history"},
    ];

    return <CommonHorizontalTab tabs={tabs} basePath={basePath}/>;
}

export const AssignmentDetailsLayout = () => {
    return (
        <CommonAppLayout>
            <Container className="p-2 mt-3">
                <AssignmentInfoHeader/>
                <AssignmentHorizontalTab/>
                <Outlet/>
            </Container>
        </CommonAppLayout>
    );
}