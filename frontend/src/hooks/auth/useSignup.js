import {signup} from "../../services/AuthService";
import {Cookies} from "../../constants/data/Cookies";
import {toast} from "react-toastify";
import {DefaultRoleBaseRoutes} from "../../router/core/RoleBasedRoutes";

export function useSignUp(formData) {

    return async (e) => {
        e.preventDefault();
        try {
            const {success, data, message} = await signup(formData);
            if (success) {
                const {accessToken, basicUserInfoResponse} = data.result;
                Cookies.setCookie(Cookies.accessToken, accessToken);
                Cookies.setCookie(Cookies.userInfo, basicUserInfoResponse);
                Cookies.setCookie(Cookies.mainRole, basicUserInfoResponse.roles[0]);

                toast.success("Đăng ký thành công. Đang chuyển hướng...");
                setTimeout(() => {
                    window.location.href = DefaultRoleBaseRoutes(Cookies.getCookie(Cookies.mainRole));
                }, 3000);
            } else {
                toast.error(message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
}
