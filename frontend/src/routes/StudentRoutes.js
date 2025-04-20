import { Route } from 'react-router-dom';
import { RoleBasedRoute } from './routes-config/RoutesConfig';

import { UserRoles } from '../constants/data/UserRoles';
import { Endpoints } from '../constants/links/Endpoints';

import { ClassroomListPage, ClassroomAssignmentPage, ClassroomDocumentPage, ClassroomMemberPage } from "../pages/classroom/ClassroomPages"
import { ClassroomInfoProvider } from '../components/context/ClassroomInfoContext';
import { ClassroomDetailsLayout } from '../components/layout/ClassroomDetailsLayout';
import { AllPagesLayout } from '../components/layout/AllPagesLayout';

export const StudentRoutes = [
    <Route
        key="classroom"
        path={Endpoints.student.classroom}
        element={
            <RoleBasedRoute
                allowedRoles={[UserRoles.STUDENT.value]}
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
        path={`${Endpoints.student.classroom}/:id/*`}
        element={
            <RoleBasedRoute
                allowedRoles={[UserRoles.STUDENT.value]}
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
