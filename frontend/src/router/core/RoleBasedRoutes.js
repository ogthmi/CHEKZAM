import {Navigate, useParams} from 'react-router-dom';
import {Cookies} from "../../constants/data/Cookies";
import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";

export const DefaultRoleBaseRoutes = (actualRole) => {
    if (actualRole === UserRoles.admin.value) {
        return Endpoints.admin.userManagement;
    }
    else {
        console.info("[Redirect to]", Endpoints.classroom.root(actualRole.toLowerCase()))
        return Endpoints.classroom.root(actualRole.toLowerCase())
    }
}

export const RoleBasedRoute = ({ allowedRoles, children }) => {
    console.log('[DEBUG] RoleBasedRoute rendered');
    const { userRole } = useParams();
    const actualRole = Cookies.getCookie(Cookies.mainRole); // UPPERCASE
    const isAuthenticated = !!Cookies.getCookie(Cookies.accessToken);
    const hasUserInfo = !!Cookies.getCookie(Cookies.userInfo);

    console.log('[DEBUG] actualRole (from cookie):', actualRole);
    console.log('[DEBUG] userRole (param):', userRole);
    console.log('[DEBUG] allowedRoles:', allowedRoles);
    console.log('[DEBUG] isAuthenticated:', isAuthenticated, '| hasUserInfo:', hasUserInfo);

    // 1. Check auth/session
    if (!isAuthenticated || !actualRole || !hasUserInfo) {
        console.warn('[DEBUG] Session invalid, redirecting to landing');
        return <Navigate to={Endpoints.home.landing} replace />;
    }

    // 2. Check role hợp lệ
    if (!allowedRoles.includes(actualRole)) {
        console.warn('[DEBUG] Role not allowed! actualRole:', actualRole);
        return <Navigate to={Endpoints.error.forbidden} replace />;
    }

    // 3. Check param userRole với actualRole
    const userRoleUpper = userRole?.toUpperCase();
    if (userRole && userRoleUpper !== actualRole) {
        console.warn('[DEBUG] Role mismatch! userRole:', userRoleUpper, '| actualRole:', actualRole);
        return <Navigate to={DefaultRoleBaseRoutes(actualRole)} replace />;
    }

    console.info('[DEBUG] Access granted!');
    return children;
};
