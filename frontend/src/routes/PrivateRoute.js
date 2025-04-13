import { Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookiesUtil";
import { COOKIES } from "../constants/data";
import { SUB_ENDPOINTS } from "../constants/endPoints";

export const PrivateRoute = ({ element }) => {
  const isAuthenticated = getCookie(COOKIES.token); // Kiểm tra token
  return isAuthenticated ? element : <Navigate to={SUB_ENDPOINTS.home.landing} />;
};

