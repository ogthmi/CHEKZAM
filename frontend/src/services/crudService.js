import { API } from "../constants/api"
import { COOKIES, HTTP_METHOD, FORM_TYPE } from "../constants/data"
import { ERROR } from "../constants/error"
import { getCookie } from "../utils/cookiesUtil"
import makeRequest from "./requestService"

function routeSingleAPI(formType){
    switch (formType) {
        case FORM_TYPE.user:
            return API.user.none
        case FORM_TYPE.classroom.classroomInfo:
            return API.classroom.none
        case FORM_TYPE.classroom.classroomMember:
            return API.classroom.none
        default:
            break;
    }
}

export const getData = async (formType, itemId, containerId = null) => {
    const token = getCookie(COOKIES.token);
    try {
        const api = routeSingleAPI(formType) + (containerId? "/" + containerId : "") + "/" + itemId
        const response = await makeRequest(`${routeSingleAPI(formType)}/${itemId}`, HTTP_METHOD.get, null, token)
        const { success, data, message } = response;

        if (!success) throw new Error(message || ERROR.DELETED_FAILED);

        return data.result;
    }
    catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.DELETED_FAILED }
    }
}

export const deleteData = async (formType, itemIdToDelete, containerId = null) => {
    const token = getCookie(COOKIES.token);
    try {
        const api = routeSingleAPI(formType) + (containerId? "/" + containerId : "") + "/" + itemIdToDelete
        const response = await makeRequest(`${routeSingleAPI(formType)}/${itemIdToDelete}`, HTTP_METHOD.delete, null, token)
        const { success, data, message } = response;

        if (!success) throw new Error(message || ERROR.DELETED_FAILED);

        return data.result;
    }
    catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.DELETED_FAILED }
    }

}

export const createData = async (formType, containerId = null, itemIdToCreate = null, body) => {
    const token = getCookie(COOKIES.token);
    try {
        const api = routeSingleAPI(formType) + (containerId? "/" + containerId : "")+ (itemIdToCreate? "/" + itemIdToCreate : "")
        const response = await makeRequest(api, HTTP_METHOD.post, body, token)
        const { success, data, message } = response;

        if (!success) throw new Error(message || ERROR.CREATED_FAILED);

        return data.result;
    }
    catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.UNDEFINED_ERROR }
    }

}

export const updateData = async (formType, containerId = null, itemIdToCreate = null, body) => {
    const token = getCookie(COOKIES.token);
    try {
        const api = routeSingleAPI(formType) + (containerId? "/" + containerId : "")+ (itemIdToCreate? "/" + itemIdToCreate : "")
        const response = await makeRequest(api, HTTP_METHOD.put, body, token)
        const { success, data, message } = response;

        if (!success) throw new Error(message || ERROR.CREATED_FAILED);

        return data.result;
    }
    catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.UNDEFINED_ERROR }
    }

}