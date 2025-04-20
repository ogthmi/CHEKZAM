import { UserRoles } from "../data/UserRoles";

export const RootEndpoints = {
    auth: '/auth',
    error: '/error', 
    admin: '/' + UserRoles.ADMIN.value.toLowerCase(),
    teacher: '/' + UserRoles.TEACHER.value.toLowerCase(),
    student: '/' + UserRoles.STUDENT.value.toLowerCase(),
}

export const Endpoints = {
    home: {
        landing: '/',
    },
    auth: {
        signin: RootEndpoints.auth + '/signin',
        signup: RootEndpoints.auth + '/signup',
        forgot_password: RootEndpoints.auth + '/forgot',
    },
    error: {
        forbiden: RootEndpoints.error + '/403',
        not_found: RootEndpoints.error + '/404',
        internal_server: RootEndpoints.error + '/500',
    },
    admin: {
        dashboard: RootEndpoints.admin + "/dashboard",
    },
    teacher: {
        classroom: RootEndpoints.teacher + '/classroom',
        assignment: RootEndpoints.teacher + '/assignment',
    },
    student: {
        classroom: RootEndpoints.student + '/classroom',
    }
};

export const DYNAMIC_ENDPOINTS = {
    classroom_assignment: "/:id/assignment"
}


