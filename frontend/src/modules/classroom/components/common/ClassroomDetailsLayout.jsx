import {Container} from "react-bootstrap";
import {CommonAppLayout} from "../../../../ui/components/layout/CommonAppLayout"
import {ClassroomInfoHeader} from "./ClassroomInfoHeader";
import {CommonHorizontalTab} from "../../../../ui/components/layout/CommonHorizontalTab";
import {useParams, useLocation} from "react-router-dom";
import {Outlet} from "react-router-dom";
import {ClassroomInfoProvider} from "./ClassroomInfoContext";

export function ClassroomHorizontalTab() {
    const {userRole, classroomId} = useParams();
    const basePath = `/${userRole}/classroom/${classroomId}`;
    const tabs = [
        {key: "assignment", label: "Bài tập", path: "assignment"},
        // {key: "document", label: "Tài liệu", path: "document"},
        {key: "member", label: "Thành viên", path: "member"}
    ];

    return <CommonHorizontalTab tabs={tabs} basePath={basePath}/>;
}

export const ClassroomDetailsLayout = () => {
    console.log("ClassroomDetailsLayout");
    return (
        <CommonAppLayout>
            <Container className="p-2 mt-3">
                <ClassroomInfoHeader/>
                <ClassroomHorizontalTab/>
                <Outlet/>
            </Container>
        </CommonAppLayout>
    );
}