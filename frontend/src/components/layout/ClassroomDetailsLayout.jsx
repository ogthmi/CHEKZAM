import { Container } from "react-bootstrap";
import { SharedLayout } from "./SharedLayout"
import { ClassroomDetailsHeader } from "../classroom/ClassroomDetailsHeader";
import { CustomHorizontalTab } from "../common/CustomHorizontalTab";
import { useParams, useLocation } from "react-router-dom";

export function ClassroomHorizontalTab() {
    const { id } = useParams();
    const role = useLocation().pathname.split("/")[1];

    const basePath = `/${role}/classroom/${id}`;
    const tabs = [
        { key: "assignment", label: "Bài tập", path: "assignment" },
        { key: "document", label: "Tài liệu", path: "document" },
        { key: "member", label: "Thành viên", path: "member" }
    ];

    return <CustomHorizontalTab tabs={tabs} basePath={basePath} />;
}

export const ClassroomDetailsLayout = ({ children }) => {
    return (
        <SharedLayout>
            <Container className="p-2 mt-3">
                <ClassroomDetailsHeader />
                <ClassroomHorizontalTab/>
                <main>{children}</main>
            </Container>
        </SharedLayout>
    );
}