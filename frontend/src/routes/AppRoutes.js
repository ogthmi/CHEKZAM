import { Route } from "react-router-dom"
import { PublicRoutes } from "./PublicRoutes"
import { AdminRoutes } from "./AdminRoutes"
import { TeacherRoutes } from "./TeacherRoutes"
import { StudentRoutes } from "./StudentRoutes"

import { Error403, Error404 } from "../pages/error/CustomErrorPage"
import { Endpoints } from "../constants/links/Endpoints"

export const AppRoutes = [
    ...PublicRoutes,
    ...AdminRoutes,
    ...TeacherRoutes,
    ...StudentRoutes,
    <Route key="not-found" path="*" element={<Error404 />} />,
    <Route key="forbidden" path={Endpoints.error.forbiden} element={<Error403 />} />,
]