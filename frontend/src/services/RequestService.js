import {Cookies} from "../constants/data/Cookies";
import {ErrorMessages} from "../constants/messages/ErrorMessages";
import {ApiLinks} from "../constants/links/ApiLinks";
import {Endpoints} from "../constants/links/Endpoints";
import {toast} from "react-toastify";

export const makeRequest = async (url, method, body = null, needToken = false) => {
    const headers = {"Content-Type": "application/json"};
    if (needToken) {
        const accessToken = Cookies.getCookie(Cookies.accessToken);
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const options = {headers, method,};
    if (body) options.body = JSON.stringify(body);

    const response = await sendRequest(url, options);
    if (response.success) return response;

    if (response.status === 401) {
        const isTokenRefreshed = await refreshToken();
        if (isTokenRefreshed) {
            const newAccessToken = Cookies.getCookie(Cookies.accessToken);
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return await sendRequest(url, options);
        } else {
            return {
                success: false,
                message: ErrorMessages.FETCH_FAILED
            };
        }
    }
    if (response.status === 400) {
        toast.error(response.message)
    }
    return response;
};

const sendRequest = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: data.message || 'Unknown error',
            }
        }
        console.info('[Sent request successfully] ');
        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error('[Sent request error] ', error.message);
        return {
            success: false,
            status: 500,
            message: error.message || ErrorMessages.SERVICE_CONNECTION_FAILED,
        };
    }
}

const refreshToken = async () => {
    try {
        const accessToken = Cookies.getCookie(Cookies.accessToken);
        const response = await fetch(
            ApiLinks.auth.refreshToken,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token: accessToken}),
            }
        );
        if (!response.ok) return false;
        console.info('[Refreshed token successfully] ');
        const data = await response.json();
        Cookies.setCookie(Cookies.accessToken, data.result.token);
        return true;
    } catch (error) {
        console.error('[Refresh token failed] ', error);
        return false;
    }
};

export const signout = async () => {
    const accessToken = Cookies.getCookie(Cookies.accessToken);
    const response = await fetch(
        ApiLinks.auth.signout,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authrozation': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({accessToken}),
        }
    );
    if (response) {
        Cookies.removeCookie(Cookies.accessToken);
        Cookies.removeCookie(Cookies.userInfo);
        Cookies.removeCookie(Cookies.mainRole);
        window.location.href = Endpoints.home.landing;
        console.info('[Signed out successfully]');
    }
}