import {Route, Routes} from 'react-router-dom';
import {Error404} from "../modules/error/ErrorPagesModule";
import {PublicRoutes} from "./page-routes/PublicRoutes";
import {ClassroomRoutes} from "./page-routes/ClassroomRoutes";
import {AssignmentRoutes} from "./page-routes/AssignmentRoutes";
import {AdminRoutes} from "./page-routes/AdminRoutes";
import {UserProfileRoutes} from "./page-routes/UserProfileRoutes";

export const AppRoutes = () => {
    return (
        <Routes>
            {PublicRoutes}
            {ClassroomRoutes}
            {AssignmentRoutes}
            {AdminRoutes}
            {UserProfileRoutes}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};
