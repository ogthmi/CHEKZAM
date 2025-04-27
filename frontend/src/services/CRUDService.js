import {ApiLinks} from "../constants/links/ApiLinks"
import {HttpMethod} from "../constants/data/ActionMethods"
import {EntityTypes} from "../constants/data/EntityTypes";
import {ErrorMessages} from "../constants/messages/ErrorMessages"
import {makeRequest} from "./RequestService"

function toAPI(entityType, containerId, itemId) {
    switch (entityType) {
        case EntityTypes.user.SEARCH:
            return ApiLinks.user.search(itemId)
        case EntityTypes.user.INFO:
            return ApiLinks.user.byId(itemId)
        case EntityTypes.classroom.INFO:
            return ApiLinks.classroom.byId(itemId)
        case EntityTypes.classroom.STUDENT:
            return ApiLinks.classroomMember.root(containerId)
        case EntityTypes.assignment.DETAILS:
            return ApiLinks.assignment.byId(itemId)
        default:
            break;
    }
}

export const getData = async (entityType, containerId, itemId) => {
    try {
        const API = toAPI(entityType, containerId, itemId);
        console.info("[Call ApiLinks] ", API);
        const {success, data} = await makeRequest(API, HttpMethod.GET, null, true)
        if (success) return data.result;
    } catch (error) {
        console.error(error.message);
        return {success: false, message: error.message || ErrorMessages.FETCH_FAILED}
    }
}

export const deleteData = async (entityType, containerId, itemIdToDelete) => {
    try {
        const api = toAPI(entityType, containerId, itemIdToDelete)
        console.info("[Call ApiLinks] ", ApiLinks);
        const response = await makeRequest(api, HttpMethod.DELETE, null, true)
        console.info(response)
        return response;
    } catch (error) {
        console.error("[Có lỗi xảy ra] ", error.message);
        return {success: false, message: error.message || ErrorMessages.DELETED_FAILED}
    }
}

export const createData = async (entityType, containerId, itemIdToCreate, body) => {
    try {
        const API = toAPI(entityType, containerId, itemIdToCreate)
        console.info("[Call ApiLinks] ", API);
        const response = await makeRequest(API, HttpMethod.POST, body, true)
        console.info(response)
        return response;
    } catch (error) {
        console.error("[Có lỗi xảy ra] ", error.message);
        return {success: false, message: error.message || ErrorMessages.CREATED_FAILED}
    }
}

export const updateData = async (entityType, containerId, itemIdToCreate, body) => {
    try {
        const API = toAPI(entityType, containerId, itemIdToCreate);
        console.info("[Call ApiLinks] ", API);
        const {success, data} = await makeRequest(API, HttpMethod.PUT, body, true)
        if (success) return data.result;
    } catch (error) {
        console.error("[Có lỗi xảy ra] ", error.message);
        return {success: false, message: error.message || ErrorMessages.UPDATED_FAILED}
    }
}