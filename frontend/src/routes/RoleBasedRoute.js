import { PrivateRoute } from "./PrivateRoute";
import { getCookie } from "../utils/cookiesUtil";
import { COOKIES } from "../constants/data";
import { Navigate } from "react-router-dom";
import { SUB_ENDPOINTS } from "../constants/endPoints";

export const getRedirectRouteByRole = () => {
    const mainRole = getCookie(COOKIES.mainRole);
    if (!mainRole) return SUB_ENDPOINTS.home.landing;
    const roleRoutes = {
        admin: SUB_ENDPOINTS.admin.dashboard,
        teacher: SUB_ENDPOINTS.teacher.classroom,
        student: SUB_ENDPOINTS.student.classroom,
    };
    return roleRoutes[mainRole.toLowerCase()] || SUB_ENDPOINTS.home.landing;
};


const RoleBasedRoute = ({ element, allowedRoles }) => {
    const userRole = getCookie(COOKIES.mainRole)?.toLowerCase();

    if (!userRole) {
        return <Navigate to={SUB_ENDPOINTS.home.landing} replace />;
    }

    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles.map(role => role.toLowerCase()) : [allowedRoles.toLowerCase()];

    const hasPermission = rolesArray.includes(userRole);

    if (!hasPermission) {
        const fallbackRoute = getRedirectRouteByRole(userRole);
        return <Navigate to={fallbackRoute} replace />;
    }

    return <PrivateRoute element={element} />;
};

export default RoleBasedRoute;
