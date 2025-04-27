import {EntityTypes} from "../constants/data/EntityTypes";
import {ApiLinks} from "../constants/links/ApiLinks";
import {ErrorMessages} from "../constants/messages/ErrorMessages";
import {makeRequest} from "./RequestService";

function routePaginatedAPI(object, containerId) {
    switch (object) {
        case EntityTypes.user.INFO:
            return ApiLinks.user.all
        case EntityTypes.classroom.INFO:
            return ApiLinks.classroom.all
        case EntityTypes.classroom.STUDENT:
            return ApiLinks.classroomMember.all(containerId)
        case EntityTypes.assignment.INFO:
            return ApiLinks.assignment.all;
        default:
            break;
    }
}

export const getPaginatedData = async (object, containerId, pageNumber, pageSize, sortBy, direction, keyword) => {
    const queryParams = new URLSearchParams(
        {pageNumber: pageNumber - 1, pageSize, sortBy, direction, keyword}
    );
    const paginatedApi = `${routePaginatedAPI(object, containerId)}?${queryParams.toString()}`
    console.info("[Call Paginated ApiLinks] ", paginatedApi)
    try {
        const response = await makeRequest(
            paginatedApi,
            'GET',
            null,
            true
        );
        const {success, data, message} = response;
        if (!success) throw new Error(message || ErrorMessages.FETCH_FAILED);
        return {
            objectContents: data.result.content,
            totalPages: data.result.page.totalPages,
            totalElements: data.result.page.totalElements
        };
    } catch (error) {
        console.log(error.message);
        return {success: false, message: error.message || ErrorMessages.FETCH_FAILED};
    }
}