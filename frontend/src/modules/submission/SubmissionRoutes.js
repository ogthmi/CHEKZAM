import {Route} from "react-router-dom";
import {RoleBasedRoute} from "../../router/core/RoleBasedRoutes";
import {UserRoles} from "../../constants/data/UserRoles";
import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";

import {SubmissionDetailsPage} from "./SubmissionDetailsPage";
import {SubmissionListPage} from "./SubmissionListPage";

export const SubmissionRoutes = [
    <Route
        key="submission-layout"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.admin.value, UserRoles.teacher.value, UserRoles.student.value]}>
                <CommonAppLayout/>
            </RoleBasedRoute>
        }
    >
        <Route path={"/submission"} element={<SubmissionListPage/>}/>
    </Route>,
    <Route
        path={`/submission/:submissionId`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.admin.value, UserRoles.teacher.value, UserRoles.student.value]}>
                <CommonAppLayout/>
            </RoleBasedRoute>
        }
    >
        <Route path={`details`} element={<SubmissionDetailsPage/>}/>
    </Route>,
]