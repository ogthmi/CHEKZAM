import {Container} from "react-bootstrap";
import {AllPagesLayout} from "./AllPagesLayout"
import {ClassroomInfoHeader} from "../header/ClassroomInfoHeader";
import {CustomHorizontalTab} from "../common/CustomHorizontalTab";
import {useParams, useLocation} from "react-router-dom";
import {Outlet} from "react-router-dom";
import {ClassroomInfoProvider} from "../context/ClassroomInfoContext";

export function ClassroomHorizontalTab() {
    const {userRole, classroomId} = useParams();
    const basePath = `/${userRole}/classroom/${classroomId}`;
    const tabs = [
        {key: "assignment", label: "Bài tập", path: "assignment"},
        {key: "document", label: "Tài liệu", path: "document"},
        {key: "member", label: "Thành viên", path: "member"}
    ];

    return <CustomHorizontalTab tabs={tabs} basePath={basePath}/>;
}

export const ClassroomDetailsLayout = () => {
    console.log("ClassroomDetailsLayout");
    return (
        <AllPagesLayout>
            <Container className="p-2 mt-3">
                <ClassroomInfoHeader/>
                <ClassroomHorizontalTab/>
                <Outlet/>
            </Container>
        </AllPagesLayout>
    );
}