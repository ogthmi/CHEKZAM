import {Route, Routes} from 'react-router-dom';
import {Error404} from "../pages/error/CustomErrorPage";
import {PublicRoutes} from "./page-routes/PublicRoutes";
import {ClassroomRoutes} from "./page-routes/ClassroomRoutes";
import {AssignmentRoutes} from "./page-routes/AssignmentRoutes";

export const AppRoutes = () => {
    return (
        <Routes>
            {PublicRoutes}
            {ClassroomRoutes}
            {AssignmentRoutes}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};
