import React from 'react';
import {Navigate, Route, useParams} from 'react-router-dom';
import {Cookies} from "../../constants/data/Cookies";
import {Endpoints} from "../../constants/links/Endpoints";
import {UserRoles} from "../../constants/data/UserRoles";
import {UserProfilePage} from "../../modules/user/pages/UserProfilePage";

const UserProfileRouteConfig = ({ children }) => {
    const params = useParams();
    const actualRole = Cookies.getCookie(Cookies.mainRole);
    const currentUserInfo = Cookies.getCookie(Cookies.userInfo);
    const isAuthenticated = !!Cookies.getCookie(Cookies.accessToken);

    if (!isAuthenticated || !currentUserInfo || !actualRole) {
        return <Navigate to={Endpoints.home.landing} replace />;
    }

    const currentUserId = currentUserInfo.userId;
    const isAdmin = actualRole === UserRoles.admin.value;

    const paramUserId = params.userId || currentUserId;

    if (!isAdmin && paramUserId !== currentUserId) {
        return <Navigate to={Endpoints.error.forbidden} replace />;
    }

    // Chỉ admin mới inject userId prop
    return isAdmin
        ? React.cloneElement(children, {userId: paramUserId})
        : children;
};



export const UserProfileRoutes = [
    <Route
        key="my-profile"
        path="user/my-profile"
        element={
            <UserProfileRouteConfig>
                <UserProfilePage />
            </UserProfileRouteConfig>
        }
    />,
    <Route
        key="user-profile"
        path="user/:userId"
        element={
            <UserProfileRouteConfig>
                <UserProfilePage />
            </UserProfileRouteConfig>
        }
    />
];


