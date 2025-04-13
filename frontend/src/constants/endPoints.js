import { ROLES } from "./roles";

export const MAIN_ENDPOINTS = {
    auth: '/auth',
    error: '/error', 
    admin: '/' + ROLES.admin.name.toLowerCase(),
    teacher: '/' + ROLES.teacher.name.toLowerCase(),
    student: '/' + ROLES.student.name.toLowerCase(),
}

export const SUB_ENDPOINTS = {
    home: {
        landing: '/',
    },
    auth: {
        signin: MAIN_ENDPOINTS.auth + '/signin',
        signup: MAIN_ENDPOINTS.auth + '/signup',
        forgot_password: MAIN_ENDPOINTS.auth + '/forgot',
    },
    error: {
        forbiden: MAIN_ENDPOINTS.error + '/403',
        not_found: MAIN_ENDPOINTS.error + '/404',
        internal_server: MAIN_ENDPOINTS.error + '/500',
    },
    admin: {
        dashboard: MAIN_ENDPOINTS.admin + "/dashboard",
    },
    teacher: {
        classroom: MAIN_ENDPOINTS.teacher + '/classroom',
    },
    student: {
        classroom: MAIN_ENDPOINTS.student + '/classroom',
    }
};

export const DYNAMIC_ENDPOINTS = {
    classroom_assignment: "/:id/assignment"
}


