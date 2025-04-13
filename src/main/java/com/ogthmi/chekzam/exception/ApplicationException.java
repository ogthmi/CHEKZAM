package com.ogthmi.chekzam.exception;

public class ApplicationException extends RuntimeException {
    private final int exceptionCode;

    public ApplicationException(MessageCode messageCode) {
        super(messageCode.getMessage());
        this.exceptionCode = messageCode.getCode();
    }

    public int getExceptionCode() {
        return exceptionCode;
    }
}
