package com.ogthmi.chekzam.common.exception;

import com.ogthmi.chekzam.common.ApiResponse;
import com.ogthmi.chekzam.common.message.ExceptionMessageCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException (RuntimeException exception){
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(ExceptionMessageCode.INTERNAL_EXCEPTION.getCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = ApplicationException.class)
    ResponseEntity<ApiResponse<?>> handlingApplicationException (ApplicationException exception){
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(exception.getExceptionCode());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleJsonParseError(HttpMessageNotReadableException exception) {
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(9998);
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
