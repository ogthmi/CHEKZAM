import {ApiLinks} from "../constants/links/ApiLinks";
import {HttpMethod} from "../constants/data/ActionMethods";
import {makeRequest} from "./RequestService";

export const signin = async (data) => {
    return await makeRequest(ApiLinks.auth.signin, HttpMethod.POST, data);
};

export const signup = async (formData) => {
    return await makeRequest(ApiLinks.auth.signup, HttpMethod.POST, formData);
};
