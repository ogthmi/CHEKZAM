import { API } from "../constants/api";
import { HTTP_METHOD } from "../constants/data";
import makeRequest from "./requestService";

export const signin = async (data) => {
    return makeRequest(API.auth.signin, HTTP_METHOD.post, data, null);
};

export const signup = async (formData) => {
    return makeRequest(API.auth.signup, HTTP_METHOD.post, formData, null);
};

export const signout = async (token) => {
    return makeRequest(API.auth.signout, HTTP_METHOD.post, token, null)
}
