package com.ogthmi.chekzam.exception;

import com.ogthmi.chekzam.exception.message.ExceptionMessageCode;
import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {
    private final int exceptionCode;

    public ApplicationException(ExceptionMessageCode exceptionMessageCode) {
        super(exceptionMessageCode.getMessage());
        this.exceptionCode = exceptionMessageCode.getCode();
    }
}
