package com.ogthmi.chekzam.constant;

public class Endpoint {
    public static final String API = "/api";

    public static class Auth {
        public static final String ROOT = API + "/auth";
        public static final String SIGNIN = "/signin";
        public static final String SIGNUP = "/signup";
        public static final String SIGNOUT = "/signout";
        public static final String TOKEN = "/token";
    }

    public static class User {
        public static final String ROOT = API + "/users";
        public static final String GET_ALL = "/all";
        public static final String GET_ONE = "/{userId}";
        public static final String GET_ME = "/me";
    }

    public static class Classroom {
        public static final String ROOT = API + "/classrooms";
        public static final String GET_ALL = "/all";
        public static final String GET_ONE = "/{classroomId}";
        public static final String GET_ALL_MEMBERS = GET_ONE + "/members" + GET_ALL;
        public static final String GET_ONE_MEMBER = GET_ONE + "/members" + "/{studentId}";
    }

    public static class Document {
        public static final String ROOT = API + "/documents";
    }

    public static class Assignment {
        public static final String ROOT = API + "/assignments";
    }

    public static final String[] PUBLIC_ENDPOINTS = {
            "/", "auth/**",
            Auth.ROOT + "/**",
    };
}
