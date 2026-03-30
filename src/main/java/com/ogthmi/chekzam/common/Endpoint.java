package com.ogthmi.chekzam.common;

public class Endpoint {
    public static final String API = "/api";

    public static class Auth {
        public static final String ROOT = API + "/auth";
        public static final String SIGNIN = "/signin";
        public static final String SIGNUP = "/signup";
        public static final String SIGNOUT = "/signout";
    }

    public static class Token {
        public static final String ROOT = "/token";
        public static final String VALIDATE = ROOT + "/validate";
        public static final String REFRESH = ROOT + "/refresh";

    }

    public static class User {
        public static final String ROOT = API + "/user";
        public static final String GET_ALL = "/all";
        public static final String GET_ONE = "/{userId}";
        public static final String GET_ME = "/me";
    }

    public static class Classroom {
        public static final String ROOT = API + "/classroom";
        public static final String GET_ALL = "/all";
        public static final String GET_ONE = "/{classroomId}";
        public static final String MEMBER = GET_ONE + "/member";
        public static final String GET_ALL_MEMBERS = MEMBER + GET_ALL;
        public static final String GET_ONE_MEMBER = MEMBER + "/{studentId}";
        public static final String GET_ME = MEMBER + "/me";
        public static final String ASSIGNMENT = GET_ONE + "/assignment";
        public static final String GET_ALL_ASSIGNMENTS = ASSIGNMENT + GET_ALL;
        public static final String GET_ONE_ASSIGNMENT = ASSIGNMENT + "/{assignmentId}";
    }

    public static class Document {
        public static final String ROOT = API + "/document";
    }

    public static class Assignment {
        public static final String ROOT = API + "/assignment";
        public static final String GET_ALL = "/all";
        public static final String GET_ONE = "/{assignmentId}";
        public static final String ASSIGNED_CLASSROOM = GET_ONE + "/classroom";
        public static final String QUESTION = GET_ONE + "/question";
    }

    public static final String[] PUBLIC_ENDPOINTS = {
            "/", "auth/**",
            Auth.ROOT + "/**",
    };
}
