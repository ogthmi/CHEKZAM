import {Route} from "react-router-dom";
import {RoleBasedRoute} from "../../router/core/RoleBasedRoutes";
import {UserRoles} from "../../constants/data/UserRoles";
import {Endpoints} from "../../constants/links/Endpoints";
import {CommonAppLayout} from "../../ui/components/layout/CommonAppLayout";
import {AdminUserManagementPage} from "./AdminUserManagementPage";
import {AdminClassroomDashboardPage} from "./AdminClassroomDashboardPage";

export const AdminRoutes = [
    <Route
        key="admin-user-management"
        element={
            <RoleBasedRoute allowedRoles={[UserRoles.admin.value]}>
                <CommonAppLayout/>
            </RoleBasedRoute>
        }
    >
        <Route
            path={Endpoints.admin.userManagement}
            element={<AdminUserManagementPage/>}
        />
        <Route
            path={Endpoints.admin.classroomDashboard}
            element={<AdminClassroomDashboardPage/>}
        />
    </Route>,
]