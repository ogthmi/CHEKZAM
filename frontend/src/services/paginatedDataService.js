import { getCookie } from "../utils/cookiesUtil";
import { COOKIES, HTTP_METHOD, FORM_TYPE } from "../constants/data";
import { API } from "../constants/api";
import { ERROR } from "../constants/error";
import makeRequest from "./requestService";

function routePaginatedAPI(object, containerId = null) {
    switch (object) {
        case FORM_TYPE.user:
            return API.user.all
        case FORM_TYPE.classroom.classroomInfo:
            return API.classroom.all
        case FORM_TYPE.classroom.classroomMember:
            return API.classroom.none + `/${containerId}/members/all`
        default:
            break;
    }
}

export const getPaginatedData = async (object, containerId, pageNumber, pageSize, sortBy, direction, keyword) => {
    const token = getCookie(COOKIES.token);

    const queryParams = new URLSearchParams({ pageNumber: pageNumber - 1, pageSize, sortBy, direction, keyword });

    try {
        const response = await makeRequest(`${routePaginatedAPI(object, containerId)}?${queryParams.toString()}`, HTTP_METHOD.get, null, token);
        const { success, data, message } = response;

        if (!success) throw new Error(message || ERROR.FETCH_FAILED);

        return {
            objectContents: data.result.content,
            totalPages: data.result.page.totalPages,
            totalElements: data.result.page.totalElements
        };
    } catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.FETCH_FAILED };
    }
}