import { useState, useCallback } from 'react';

export const useQueryParams = (initialQueryParams = {}) => {
    const [queryParams, setQueryParams] = useState(initialQueryParams);

    const updateQueryParams = useCallback((newQueryParams) => {
        setQueryParams(prev => {
            const updated = { ...prev, ...newQueryParams };
            const isSame = Object.keys(updated).every(
                key => prev[key] === updated[key]
            );
            return isSame ? prev : updated;
        });
    }, []);

    return [queryParams, updateQueryParams];
};
