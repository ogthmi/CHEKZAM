package com.ogthmi.chekzam.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ogthmi.chekzam.common.message.SuccessMessageCode;
import jakarta.annotation.Nullable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ApiResponse <T> {
    private int code = 9200;
    private String message;
    private T result;

    public static <T> ApiResponse<T> success(T result, @Nullable SuccessMessageCode successMessageCode) {
        ApiResponse<T> response = new ApiResponse<>();
        if (successMessageCode != null){
            response.setCode(successMessageCode.getCode());
            response.setMessage(successMessageCode.getMessage());
        }
        response.setResult(result);
        return response;
    }
    public static ApiResponse<Void> voidSuccess (SuccessMessageCode successMessageCode) {
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(successMessageCode.getCode());
        response.setMessage(successMessageCode.getMessage());
        return response;
    }
}
