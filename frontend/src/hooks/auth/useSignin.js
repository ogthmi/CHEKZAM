import {signin} from "../../services/AuthService";
import {DefaultRoleBaseRoutes} from "../../router/core/RoleBasedRoutes";
import {Cookies} from "../../constants/data/Cookies";
import {toast} from "react-toastify";

export function useSignIn(formData) {
    return async () => {
        try {
            const { success, data, message } = await signin(formData);
            if (success) {
                const { accessToken, basicUserInfoResponse } = data.result;
                Cookies.setCookie(Cookies.accessToken, accessToken);
                Cookies.setCookie(Cookies.userInfo, basicUserInfoResponse);
                Cookies.setCookie(Cookies.mainRole, basicUserInfoResponse.roles[0]);

                const role = Cookies.getCookie(Cookies.mainRole);
                window.location.href = DefaultRoleBaseRoutes(role);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error('[SignIn error]', error.message);
            toast.error(error.message);
        }
    };
}

