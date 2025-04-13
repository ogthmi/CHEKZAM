package com.ogthmi.chekzam.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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

    public static <T> ApiResponse<T> ok (T result) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setResult(result);
        return response;
    }
}
