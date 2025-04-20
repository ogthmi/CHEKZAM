const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const API_GROUPS = {
    auth: '/auth',
    classroom: '/classroom',
    user: '/user'
}

const buildUrl = (group, path = '') => `${BASE_API_URL}${API_GROUPS[group]}${path}`;

export const ApiLinks = {
    auth: {
        signin: buildUrl('auth', '/signin'),
        signup: buildUrl('auth', '/signup'),
        signout: buildUrl('auth', '/signout'),
        forgotPassword: buildUrl('auth', '/forgot'),
        refreshToken: buildUrl('auth', '/token/refresh'),
    },
    classroom: {
        all: buildUrl('classroom', '/all'),
        getById: (classroomId) => buildUrl('classroom', classroomId? `/${classroomId}` : ""),
        create: buildUrl('classroom'),
    },
    classroomMember: {
        root: (classroomId) => buildUrl('classroom', `/${classroomId}/member`),
        all: (classroomId) => buildUrl('classroom', `/${classroomId}/member/all`),
        getById: (classroomId, memberId) => buildUrl('classroom', `/${classroomId}/member/${memberId}`),
    },

    user: {
        all: buildUrl('user', '/all'),
        myProfile: buildUrl('user', '/my-profile'),
        byId: (id) => buildUrl('user', `/${id}`),
        search: (keyword) => buildUrl('user', `?keyword=${keyword}`),
    },
};