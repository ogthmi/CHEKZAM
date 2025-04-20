import { Route } from "react-router-dom";
import { Endpoints } from "../constants/links/Endpoints";

import { Error403, Error404, Error500 } from "../pages/error/CustomErrorPage"

export const ErrorRoutes = [
    <Route key="403" path={Endpoints.error.forbiden} element={<Error403 />} />,
    <Route key="404" path={Endpoints.error.not_found} element={<Error404 />} />,
    <Route key="500" path={Endpoints.error.internal_server} element={<Error500 />} />
];
