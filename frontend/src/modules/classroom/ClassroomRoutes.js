import {Route} from 'react-router-dom';
import {RoleBasedRoute} from "../../router/core/RoleBasedRoutes";

import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";

import {
    ClassroomAssignmentPage,
    ClassroomDocumentPage,
    ClassroomListPage,
    ClassroomMemberPage
} from "./ClassroomPagesModule";
import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";
import {ClassroomDetailsLayout} from "./components/common/ClassroomDetailsLayout";
import {ClassroomInfoProvider} from "./components/common/ClassroomInfoContext";
import {AssignmentInfoProvider} from "../assignment/components/context/AssignmentInfoContext";
import {AssignmentDetailsLayout} from "../assignment/components/context/AssignmentDetailsLayout";
import {AssignmentDetailsPage} from "../assignment/pages/AssignmentDetailsPage";
import {AssignmentSubmissionHistory} from "../assignment/pages/AssignmentSubmissionHistory";
import {DoAssignmentPage} from "../submission/DoAssignmentPage";
import {SubmissionResult} from "../submission/SubmissionResult";

export const ClassroomRoutes = [
    <Route
        key="classroom-layout"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <CommonAppLayout/>
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
        <Route path={`document`} element={<ClassroomDocumentPage/>}/>
        <Route path={`member`} element={<ClassroomMemberPage/>}/>
        <Route path={`assignment`} element={<ClassroomAssignmentPage/>}/>
    </Route>,

    <Route
        path={`${Endpoints.classroom.root(':userRole')}/:classroomId/assignment/:assignmentId`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <ClassroomInfoProvider>
                    <AssignmentInfoProvider isInClassroom={true}>
                        <AssignmentDetailsLayout isInClassroom={true}/>
                    </AssignmentInfoProvider>
                </ClassroomInfoProvider>
            </RoleBasedRoute>
        }
    >
        <Route path={'content'} element={<AssignmentDetailsPage/>}/>
        <Route path={'submission-history'} element={<AssignmentSubmissionHistory/>}/>
    </Route>,

    <Route
        path={`${Endpoints.classroom.root(':userRole')}/:classroomId/assignment/:assignmentId/do`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <ClassroomInfoProvider>
                    <AssignmentInfoProvider isInClassroom={true}>
                        <DoAssignmentPage/>
                    </AssignmentInfoProvider>
                </ClassroomInfoProvider>
            </RoleBasedRoute>
        }
    />,
    <Route
        path={`${Endpoints.classroom.root(':userRole')}/:classroomId/assignment/:assignmentId/result`}
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.teacher.value, UserRoles.student.value]}>
                <ClassroomInfoProvider>
                    <AssignmentInfoProvider isInClassroom={true}>
                        <SubmissionResult/>
                    </AssignmentInfoProvider>
                </ClassroomInfoProvider>
            </RoleBasedRoute>
        }
    />,


]