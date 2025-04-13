package com.ogthmi.chekzam.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import org.springframework.util.StringUtils;

@Component
public class PaginationUtil {

    private static final String DEFAULT_SORT_BY = "createdAt";
    private static final String DEFAULT_DIRECTION = "asc";
    private static final int DEFAULT_PAGE_SIZE = 5;
    private static final int MAX_PAGE_SIZE = 100;

    public static Pageable buildPageable(Integer pageNumber, Integer pageSize, String sortBy, String direction) {
        int safePage = (pageNumber != null && pageNumber >= 0) ? pageNumber : 0;
        int safeSize = (pageSize != null && pageSize > 0 && pageSize <= MAX_PAGE_SIZE) ? pageSize : DEFAULT_PAGE_SIZE;

        String safeSortBy = StringUtils.hasText(sortBy) ? sortBy : DEFAULT_SORT_BY;
        String safeDirection = StringUtils.hasText(direction) ? direction : DEFAULT_DIRECTION;

        Sort sort = safeDirection.equalsIgnoreCase("asc")
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();

        return PageRequest.of(safePage, safeSize, sort);
    }
}
