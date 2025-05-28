import {Route} from 'react-router-dom';
import {
    PublicSignInPage, PublicSignUpPage, PublicForgotPasswordPage, PublicLandingPage
} from "../../modules/public/PublicPagesModule"
import {Error403, Error404, Error500} from "../../modules/error/ErrorPagesModule";

import {Navigate} from 'react-router-dom';
import {Cookies} from "../../constants/data/Cookies";
import {DefaultRoleBaseRoutes} from "../core/RoleBasedRoutes";

export const GuestRoute = ({children}) => {
    const isAuthenticated = !!Cookies.getCookie(Cookies.accessToken);
    const actualRole = Cookies.getCookie(Cookies.mainRole);

    if (isAuthenticated && actualRole) {
        return <Navigate to={DefaultRoleBaseRoutes(actualRole)} replace/>;
    }
    return children;
};

export const PublicRoutes = (<Route>
    <Route path="/" element={<PublicLandingPage/>}/>
    <Route path="/auth/signin" element={<GuestRoute> <PublicSignInPage/> </GuestRoute>}/>
    <Route path="/auth/signup" element={<GuestRoute> <PublicSignUpPage/> </GuestRoute>}/>
    <Route path="/auth/forgot-password" element={<GuestRoute> <PublicForgotPasswordPage/> </GuestRoute>}/>
    <Route path="/error/403" element={<Error403/>}/>
    <Route path="/error/404" element={<Error404/>}/>
    <Route path="/error/500" element={<Error500/>}/>
    <Route path="*" element={<Error404/>}/>
</Route>);
