import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../../utils/cookiesUtil";
import { getRedirectRouteByRole } from "../../routes/RoleBasedRoute";
import { COOKIES } from "../../constants/data";

export function useAuth(authFunction) {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (data) => {
        setError(null);
        try {
            const response = await authFunction(data);
            if (response.success) {
                const info = response.data.result;

                setCookie(COOKIES.token, info.token);
                setCookie(COOKIES.compactUserInfo, info.userTokenResponse);
                const mainRole = info.userTokenResponse.roles[0];
                setCookie(COOKIES.mainRole, mainRole);

                if (data.password) setMessage("Đăng ký thành công. Đang chuyển hướng...");

                const redirectPage = getRedirectRouteByRole();
                navigate(redirectPage, { replace: true });
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const mainRole = getCookie(COOKIES.mainRole)?.toLowerCase();
        if (mainRole) {
            navigate(getRedirectRouteByRole(mainRole), { replace: true });
        }
    }, []);

    return { handleAuth, error, message };
}
