const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const API_GROUPS = {
    auth: '/auth',
    classrooms: '/classrooms',
    users: '/users'
}

export const API = {
    auth: {
        signin: BASE_API_URL + API_GROUPS.auth + "/signin",
        signup: BASE_API_URL + API_GROUPS.auth + "/signup",
        signout:BASE_API_URL + API_GROUPS.auth + "/signout",
        forgot_pswd: BASE_API_URL + API_GROUPS.auth + "/forgot"
    },
    classroom: {
        all: BASE_API_URL + API_GROUPS.classrooms + "/all",
        none: BASE_API_URL + API_GROUPS.classrooms
    },
    user: {
        all: BASE_API_URL + API_GROUPS.users + '/all',
        myProfile: BASE_API_URL + API_GROUPS.users + '/my-profile'
    }

}