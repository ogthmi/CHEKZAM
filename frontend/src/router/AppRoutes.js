import {Route, Routes} from 'react-router-dom';
import {Error404} from "../modules/error/ErrorPagesModule";
import {PublicRoutes} from "./page-routes/PublicRoutes";
import {ClassroomRoutes} from "../modules/classroom/ClassroomRoutes";
import {AssignmentRoutes} from "../modules/assignment/util/AssignmentRoutes";
import {AdminRoutes} from "../modules/admin/AdminRoutes";
import {UserProfileRoutes} from "./page-routes/UserProfileRoutes";
import {SubmissionRoutes} from "../modules/submission/SubmissionRoutes";

export const AppRoutes = () => {
    return (
        <Routes>
            {PublicRoutes}
            {ClassroomRoutes}
            {AssignmentRoutes}
            {SubmissionRoutes}
            {AdminRoutes}
            {UserProfileRoutes}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};
