import {Route} from 'react-router-dom';
import {RoleBasedRoute} from "../core/RoleBasedRoutes";

import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";

import {
    ClassroomAssignmentPage,
    ClassroomDocumentPage,
    ClassroomListPage,
    ClassroomMemberPage
} from "../../pages/classroom/ClassroomPages";
import {AllPagesLayout} from "../../components/layout/AllPagesLayout";
import {ClassroomDetailsLayout} from "../../components/layout/ClassroomDetailsLayout";
import {ClassroomInfoProvider} from "../../components/context/ClassroomInfoContext";

export const ClassroomRoutes = [
    <Route
        key="classroom-layout"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <AllPagesLayout/>
            </RoleBasedRoute>
        }
    >
        <Route
            path={Endpoints.classroom.root(':userRole')}
            element={<ClassroomListPage/>}
        />
    </Route>,

    <Route
        path={`${Endpoints.classroom.root(':userRole')}/:classroomId`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <ClassroomInfoProvider>
                    <ClassroomDetailsLayout/>
                </ClassroomInfoProvider>
            </RoleBasedRoute>
        }
    >
        <Route path={`assignment`} element={<ClassroomAssignmentPage/>}/>
        <Route path={`document`} element={<ClassroomDocumentPage/>}/>
        <Route path={`member`} element={<ClassroomMemberPage/>}/>
    </Route>


]