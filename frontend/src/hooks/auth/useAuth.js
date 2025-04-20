import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getRedirectRouteByRole} from "../../routes/routes-config/RoutesConfig";
import {Cookies} from "../../constants/data/Cookies";
import {toast} from "react-toastify"

export function useAuth(authFunction) {
    const navigate = useNavigate();
    const handleAuth = async (formData) => {
        try {
            const {success, data, message} = await authFunction(formData);
            if (success) {
                const {token, userTokenResponse} = data.result;
                const {fullName, roles} = userTokenResponse;

                Cookies.setCookie(Cookies.accessToken, token);
                Cookies.setCookie(Cookies.userInfo, {fullName, roles});
                Cookies.setCookie(Cookies.mainRole, roles[0]);

                if (authFunction === 'signin'){
                    toast.success("Đăng nhập thành công.");
                }
                else if (authFunction === 'signup'){
                    toast.success("Đăng ký thành công. Đang chuyển hướng...");
                }

                const redirectPage = getRedirectRouteByRole();
                navigate(redirectPage, {replace: true});
            } else {
                toast.error(message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    useEffect(() => {
        const mainRole = Cookies.getCookie(Cookies.mainRole)?.toLowerCase();
        if (mainRole) {
            navigate(getRedirectRouteByRole(mainRole), {replace: true});
        }
    }, [navigate]);

    return {handleAuth};
}
