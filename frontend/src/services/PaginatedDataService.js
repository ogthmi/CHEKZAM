import {EntityTypes} from "../constants/data/EntityTypes";
import {ApiLinks} from "../constants/links/ApiLinks";
import {ErrorMessages} from "../constants/messages/ErrorMessages";
import {makeRequest} from "./RequestService";

function routePaginatedAPI(object, containerId, itemId) {
    const routeMap = {
        [EntityTypes.user.PROFILE]: () => ApiLinks.user.all,
        [EntityTypes.classroom.INFO]: () => ApiLinks.classroom.all,
        [EntityTypes.classroom.ADD_STUDENT]: () => ApiLinks.classroomMember.all(containerId),
        [EntityTypes.classroom.ASSIGNMENT]: () => ApiLinks.classroomAssignment.all(containerId),
        [EntityTypes.assignment.INFO]: () => ApiLinks.assignment.all,
        [EntityTypes.assignment.QUESTIONS]: () => ApiLinks.assignment.questionList(containerId),
        [EntityTypes.assignment.SUBMISSION]: () => ApiLinks.assignment.submissionAll(containerId),
        [EntityTypes.assignment.ATTACHED_CLASSROOM]: () => ApiLinks.assignment.attachedClassroom(containerId),
        [EntityTypes.submission.INFO]: () => ApiLinks.submission.assignmentClassroomAll(containerId, itemId),
        [EntityTypes.submission.DETAILS]: () => ApiLinks.submission.detailsById(containerId),
    };

    const routeFn = routeMap[object];
    return routeFn ? routeFn() : undefined;
}


export const getPaginatedData = async ({
                                           entityType,
                                           containerId,
                                           itemId = null,
                                           pageNumber,
                                           pageSize,
                                           sortBy,
                                           direction,
                                           keyword
                                       }) => {
    const queryParams = new URLSearchParams(
        {pageNumber: pageNumber - 1, pageSize, sortBy, direction, keyword}
    );
    const paginatedApi = `${routePaginatedAPI(entityType, containerId, itemId)}?${queryParams.toString()}`
    console.info("[Call Paginated ApiLinks] ", paginatedApi)
    // console.log(containerId)
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