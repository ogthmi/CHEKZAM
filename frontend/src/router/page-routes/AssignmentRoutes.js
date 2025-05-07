import {Route} from 'react-router-dom';
import {RoleBasedRoute} from "../core/RoleBasedRoutes";

import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";


import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";
import {AssignmentListPage} from "../../modules/assignment/pages/AssignmentListPage";
import {AssignmentInfoProvider} from "../../modules/assignment/components/context/AssignmentInfoContext";
import {AssignmentDetailsLayout} from "../../modules/assignment/components/context/AssignmentDetailsLayout";
import {AssignmentDetailsPage} from "../../modules/assignment/pages/AssignmentDetailsPage";
import {AssignmentCreatePage} from "../../modules/assignment/pages/AssignmentCreatePage";

export const AssignmentRoutes = [
    <Route
        key="assignment-layout"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value]}>
                <CommonAppLayout/>
            </RoleBasedRoute>
        }
    >
        <Route path={Endpoints.assignment.root(':userRole')} element={<AssignmentListPage/>}/>
        <Route path={Endpoints.assignment.create(':userRole')} element={<AssignmentCreatePage/>}/>/>
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
        <Route path={`content`} element={<AssignmentDetailsPage/>}/>
    </Route>


]