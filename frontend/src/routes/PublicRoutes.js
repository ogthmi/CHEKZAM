import React from "react";
import { Route } from "react-router-dom";
import { Endpoints } from "../constants/links/Endpoints";

import { LandingPage, SignInPage, SignUpPage, ForgotPasswordPage } from "../pages/public/PublicPages"

export const PublicRoutes = [
    <Route key="landing" path={Endpoints.home.landing} element={<LandingPage />} />,
    <Route key="signin" path={Endpoints.auth.signin} element={<SignInPage />} />,
    <Route key="signup" path={Endpoints.auth.signup} element={<SignUpPage />} />,
    <Route key="forgot" path={Endpoints.auth.forgot_password} element={<ForgotPasswordPage />} />,
];

