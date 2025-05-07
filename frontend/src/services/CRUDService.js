import {ApiLinks} from "../constants/links/ApiLinks"
import {HttpMethod} from "../constants/data/ActionMethods"
import {EntityTypes} from "../constants/data/EntityTypes";
import {ErrorMessages} from "../constants/messages/ErrorMessages"
import {makeRequest} from "./RequestService"

const apiMap = {
    [EntityTypes.user.PROFILE]: (containerId, itemId) => ApiLinks.user.search(itemId),
    [EntityTypes.user.MY_PROFILE]: () => ApiLinks.user.myProfile,
    [EntityTypes.user.SEARCH]: (containerId, itemId) => ApiLinks.user.search(itemId),
    [EntityTypes.user.PROFILE]: (containerId, itemId) => ApiLinks.user.byId(itemId),
    [EntityTypes.classroom.INFO]: (containerId, itemId) => ApiLinks.classroom.byId(itemId),
    [EntityTypes.classroom.JOIN]: (containerId, itemId) => ApiLinks.classroomMember.getById(containerId, itemId),
    [EntityTypes.classroom.LEAVE]: (containerId, itemId) => ApiLinks.classroomMember.leave(containerId),
    [EntityTypes.classroom.ADD_STUDENT]: (containerId, itemId) => ApiLinks.classroomMember.root(containerId),
    [EntityTypes.assignment.CREATE]: () => ApiLinks.assignment.root,
    [EntityTypes.classroom.ADD_ASSIGNMENT]: (containerId, itemId) => ApiLinks.classroomAssignment.getById(containerId, itemId),
    [EntityTypes.assignment.INFO]: (containerId, itemId) => ApiLinks.assignment.byId(itemId),
};

function toAPI(entityType, containerId, itemId) {
    const apiResolver = apiMap[entityType];

    if (!apiResolver) {
        console.warn(`[toAPI] Unknown entityType: ${entityType}`);
        return null;
    }

    return apiResolver(containerId, itemId);
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