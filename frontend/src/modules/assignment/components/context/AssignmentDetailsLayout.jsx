import React from "react";
import {Container} from "react-bootstrap";
import {CommonAppLayout} from "../../../../ui/components/layout/CommonAppLayout";
import {CommonHorizontalTab} from "../../../../ui/components/layout/CommonHorizontalTab";
import {useParams, Link, Outlet} from "react-router-dom";
import {AssignmentInfoHeader} from "./AssignmentInfoHeader";
import {Endpoints} from "../../../../constants/links/Endpoints";
import {UserRoles} from "../../../../constants/data/UserRoles";
import {Cookies} from "../../../../constants/data/Cookies";

function AssignmentHorizontalTab({isInClassroom = false, params}) {
    const {userRole, assignmentId, classroomId} = params;

    let basePath;
    if (isInClassroom) {
        basePath = `/${userRole}/classroom/${classroomId}/assignment/${assignmentId}`;
    } else {
        basePath = `/${userRole}/assignment/${assignmentId}`;
    }

    const tabs = [
        ...(userRole === UserRoles.teacher.value.toLowerCase()
                ? [{key: "content", label: "Nội dung chi tiết", path: "content"}]
                : []
        ),
        ...(!isInClassroom
            ? [{key: "classroom", label: "Giao bài tập", path: "attached-classroom"}]
            : []),
        {key: "history", label: "Lịch sử nộp bài", path: "submission-history"},
    ];
    return <CommonHorizontalTab tabs={tabs} basePath={basePath}/>;
}

export const AssignmentDetailsLayout = ({isInClassroom = false}) => {
    const params = useParams();
    const {classroomId} = params;
    const defineBackEndpoint = () => {
        if (isInClassroom) {
            return Endpoints.classroom.assignment(
                Cookies.getCookie(Cookies.mainRole).toLowerCase(),
                classroomId
            );
        }
        return Endpoints.assignment.root(UserRoles.teacher.value.toLowerCase());
    };

    return (
        <CommonAppLayout>
            <Container className="p-2 mt-3">
                <div className={"mt-3"}>
                    {isInClassroom && <Link to={Endpoints.classroom.root(Cookies.getCookie(Cookies.mainRole).toLowerCase())} className="text-decoration-none text-muted me-3">
                        &laquo; Lớp học
                    </Link>}
                    <Link to={defineBackEndpoint()} className="text-decoration-none text-muted">
                        &laquo; Bài tập
                    </Link>
                </div>
                <AssignmentInfoHeader isInClassroom={isInClassroom}/>
                <AssignmentHorizontalTab isInClassroom={isInClassroom} params={params}/>
                <Outlet/>
            </Container>
        </CommonAppLayout>
    );
};
