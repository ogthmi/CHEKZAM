package com.ogthmi.chekzam.common.exception;

import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {
    private final int exceptionCode;

    public ApplicationException(ExceptionMessageCode exceptionMessageCode) {
        super(exceptionMessageCode.getMessage());
        this.exceptionCode = exceptionMessageCode.getCode();
    }
}
