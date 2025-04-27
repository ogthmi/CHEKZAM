import {Route} from 'react-router-dom';
import {RoleBasedRoute} from "../core/RoleBasedRoutes";

import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";


import {AllPagesLayout} from "../../components/layout/AllPagesLayout";
import {AssignmentListPage} from "../../pages/assignment/AssignmentListPage";
import {AssignmentInfoProvider} from "../../components/context/AssignmentInfoContext";
import {AssignmentDetailsLayout} from "../../components/layout/AssignmentDetailsLayout";
import {AssignmentDetailsPage} from "../../pages/assignment/AssignmentDetailsPage";
import {CreateAssignmentPage} from "../../pages/assignment/CreateAssignmentPage";

export const AssignmentRoutes = [
    <Route
        key="assignment-layout"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value]}>
                <AllPagesLayout/>
            </RoleBasedRoute>
        }
    >
        <Route path={Endpoints.assignment.root(':userRole')} element={<AssignmentListPage/>}/>
        <Route path={Endpoints.assignment.create(':userRole')} element={<CreateAssignmentPage/>}/>/>
    </Route>,

    <Route
        path={`${Endpoints.assignment.root(':userRole')}/:assignmentId`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value]}>
                <AssignmentInfoProvider>
                    <AssignmentDetailsLayout/>
                </AssignmentInfoProvider>
            </RoleBasedRoute>
        }
    >
        <Route path={`detail`} element={<AssignmentDetailsPage/>}/>
    </Route>


]