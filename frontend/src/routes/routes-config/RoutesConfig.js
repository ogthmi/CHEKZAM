import {Navigate} from "react-router-dom";
import {Cookies} from "../../constants/data/Cookies";
import {Endpoints} from "../../constants/links/Endpoints";

const PrivateRoute = ({element}) => {
    const isAuthenticated = Cookies.getCookie(Cookies.accessToken); // Kiểm tra token
    return isAuthenticated ? element : <Navigate to={Endpoints.home.landing}/>;
};
export const getRedirectRouteByRole = () => {
    const mainRole = Cookies.getCookie(Cookies.mainRole);
    if (!mainRole) return Endpoints.home.landing;
    const roleRoutes = {
        admin: Endpoints.admin.dashboard,
        teacher: Endpoints.teacher.classroom,
        student: Endpoints.student.classroom,
    };
    return roleRoutes[mainRole.toLowerCase()] || Endpoints.home.landing;
};

export const RoleBasedRoute = ({element, allowedRoles}) => {
    const userRole = Cookies.getCookie(Cookies.mainRole)?.toLowerCase();

    if (!userRole) {
        return <Navigate to={Endpoints.home.landing} replace/>;
    }

    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles.map(role => role.toLowerCase()) : [allowedRoles.toLowerCase()];

    const hasPermission = rolesArray.includes(userRole);

    if (!hasPermission) {
        return <Navigate to={Endpoints.error.forbiden} replace/>;
    }

    return <PrivateRoute element={element}/>;
};
