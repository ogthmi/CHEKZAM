import {Route} from 'react-router-dom';
import {RoleBasedRoute} from "../../../router/core/RoleBasedRoutes";

import {Endpoints} from "../../../constants/links/Endpoints";
import {UserRoles} from "../../../constants/data/UserRoles";


import {CommonAppLayout} from "../../../ui/components/layout/CommonAppLayout";
import {AssignmentListPage} from "../pages/AssignmentListPage";
import {AssignmentInfoProvider} from "../components/context/AssignmentInfoContext";
import {AssignmentDetailsLayout} from "../components/context/AssignmentDetailsLayout";
import {AssignmentDetailsPage} from "../pages/AssignmentDetailsPage";
import {AssignmentCreatePage} from "../pages/AssignmentCreatePage";
import {AttachedClassroomPage} from "../pages/AttachedClassroomPage";
import {AssignmentSubmissionHistory} from "../pages/AssignmentSubmissionHistory";
import {AssignmentAttachPage} from "../pages/AssignmentAttachPage";

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
        <Route path={Endpoints.assignment.create(':userRole')} element={<AssignmentCreatePage/>}/>
        <Route path={`${Endpoints.assignment.root(':userRole')}/attach`} element={
            <AssignmentAttachPage/>
        } />
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
        <Route path={`attached-classroom`} element={<AttachedClassroomPage/>}/>
        <Route path={`submission-history`} element={<AssignmentSubmissionHistory/>}/>
    </Route>,

]