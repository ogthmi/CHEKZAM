import { signin } from "../../../services/AuthService";
import { Cookies } from "../../../constants/data/Cookies";
import { toast } from "react-toastify";

export function useSignIn() {
    return async (formData) => {
        try {
            const { success, data, message } = await signin(formData);
            if (success) {
                const { accessToken, basicUserInfoResponse } = data.result;
                Cookies.setCookie(Cookies.accessToken, accessToken);
                Cookies.setCookie(Cookies.userInfo, basicUserInfoResponse);
                Cookies.setCookie(Cookies.mainRole, basicUserInfoResponse.roles[0]);
                return { success: true, role: basicUserInfoResponse.roles[0] };
            } else {
                toast.error(message);
                return { success: false };
            }
        } catch (error) {
            console.error('[SignIn error]', error.message);
            toast.error(error.message);
            return { success: false };
        }
    };
}
