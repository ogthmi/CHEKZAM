import { Route } from "react-router-dom";
import { RoleBasedRoute } from "./routes-config/RoutesConfig";

import { UserRoles } from "../constants/data/UserRoles";
import { Endpoints } from "../constants/links/Endpoints";

import { AllPagesLayout } from "../components/layout/AllPagesLayout";
import { ClassroomListPage, ClassroomAssignmentPage, ClassroomDocumentPage, ClassroomMemberPage } from "../pages/classroom/ClassroomPages";
import { ClassroomDetailsLayout } from "../components/layout/ClassroomDetailsLayout";
import { ClassroomInfoProvider } from "../components/context/ClassroomInfoContext";

export const TeacherRoutes = [
    <Route
        key="classroom"
        path={Endpoints.teacher.classroom}
        element={
            <RoleBasedRoute
                allowedRoles={[UserRoles.TEACHER.value]}
                element={
                    <AllPagesLayout>
                        <ClassroomListPage />
                    </AllPagesLayout>
                }
            />
        }
    />,

    <Route
        key="classroom-detail-layout"
        path={`${Endpoints.teacher.classroom}/:id/*`}
        element={
            <RoleBasedRoute
                allowedRoles={[UserRoles.TEACHER.value]}
                element={
                    <ClassroomInfoProvider>
                        <ClassroomDetailsLayout />
                    </ClassroomInfoProvider>
                }
            />
        }
    >
        <Route path="assignment" element={<ClassroomAssignmentPage />} />
        <Route path="document" element={<ClassroomDocumentPage />} />
        <Route path="member" element={<ClassroomMemberPage />} />
    </Route>
];
