import {Route} from 'react-router-dom';
import {SignInPage, SignUpPage, ForgotPasswordPage, LandingPage} from "../../pages/public/PublicPages"
import {Error403, Error404, Error500} from "../../pages/error/CustomErrorPage";

export const PublicRoutes = (
    <Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/error/403" element={<Error403 />} />
        <Route path="/error/404" element={<Error404 />} />
        <Route path="/error/500" element={<Error500 />} />
    </Route>
);
