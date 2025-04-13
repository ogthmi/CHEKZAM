import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SUB_ENDPOINTS } from './constants/endPoints.js';
import { ROLES } from './constants/roles.js';

import Landing from "./pages/home/Landing";
import {Classroom, ClassroomAssignment, ClassroomMember} from "./pages/home/Classroom";
import Dashboard from "./pages/home/Dashboard";

import Error403 from "./pages/error/Error403";
import Error404 from "./pages/error/Error404";
import Error500 from "./pages/error/Error500";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

import RoleBasedRoute from "./routes/RoleBasedRoute";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={SUB_ENDPOINTS.home.landing} element={<Landing />} />
                <Route path={SUB_ENDPOINTS.auth.signin} element={<SignIn />} />
                <Route path={SUB_ENDPOINTS.auth.signup} element={<SignUp />} />
                <Route path={SUB_ENDPOINTS.auth.forgot_password} element={<ForgotPassword />} />

                {/* Error Pages */}
                <Route path={SUB_ENDPOINTS.error.forbiden} element={<Error403 />} />
                <Route path={SUB_ENDPOINTS.error.not_found} element={<Error404 />} />
                <Route path={SUB_ENDPOINTS.error.internal_server} element={<Error500 />} />

                {/* Private Routes theo Role */}
                <Route
                    path={SUB_ENDPOINTS.admin.dashboard}
                    element={<RoleBasedRoute element={<Dashboard />} allowedRoles={[ROLES.admin.name]} />}
                />
                <Route
                    path={SUB_ENDPOINTS.teacher.classroom}
                    element={<RoleBasedRoute element={<Classroom />} allowedRoles={[ROLES.teacher.name]} />}
                />
                <Route
                    path={SUB_ENDPOINTS.teacher.classroom + "/:id/assignment/*"}
                    element={<RoleBasedRoute element={<ClassroomAssignment />} allowedRoles={[ROLES.teacher.name]} />}
                />
                <Route
                    path={SUB_ENDPOINTS.teacher.classroom  + "/:id/member"}
                    element={<RoleBasedRoute element={<ClassroomMember />} allowedRoles={[ROLES.teacher.name]} />}
                />
                


                <Route
                    path={SUB_ENDPOINTS.student.classroom}
                    element={<RoleBasedRoute element={<Classroom />} allowedRoles={[ROLES.student.name]} />}
                />
                <Route
                    path={SUB_ENDPOINTS.student.classroom + "/:id"}
                    element={<RoleBasedRoute element={<ClassroomAssignment />} allowedRoles={[ROLES.student.name]} />}
                />

                {/* Route mặc định cho các trang không tồn tại */}
                <Route path="*" element={<Error404 />} />
            </Routes>
        </Router>
    );
}

export default App;
