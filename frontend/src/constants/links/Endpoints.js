export const Endpoints = {
    home: {
        landing: '/',
    },
    auth: {
        signin: '/auth/signin',
        signup: '/auth/signup',
        forgotPassword: '/auth/forgot-password',
    },
    error: {
        forbidden: '/error/403',
        notFound: '/error/404',
        internalServer: '/error/500',
    },
    classroom: {
        root: (role) => `/${role}/classroom`,
        assignment: (role, classroomId) => `/${role}/classroom/${classroomId}/assignment`,
    },
    assignment: {
        domain: "/assignment",
        content: "/content",
        history: "/submission-history",
        attachedClassroom: "/attached-classroom",
        root: (role) => `/${role}/assignment`,
        create: (role) => `/${role}/assignment/create`,
    },
    admin: {
        userManagement: '/admin/user',
        classroomDashboard: '/admin/dashboard',
    },
    user: {
        myProfile: '/user/my-profile',
        getProfile: (id) => `/user/${id}`,
    }
};
