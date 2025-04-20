import { Route } from 'react-router-dom';
import { RoleBasedRoute } from './routes-config/RoutesConfig';

import { UserRoles } from '../constants/data/UserRoles';
import { Endpoints } from '../constants/links/Endpoints';

import { DashboardPage } from '../pages/admin/Dashboard';

export const AdminRoutes = [
    <Route
        key='dashboard'
        path={Endpoints.admin.dashboard}
        element={<RoleBasedRoute element={<DashboardPage />} allowedRoles={[UserRoles.ADMIN.value]} />}
    />
];
