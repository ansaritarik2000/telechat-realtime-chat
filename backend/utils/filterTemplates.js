// pagination.js
export const applyPagination = (query, page, limit) => {
    const offset = Number((page - 1) * limit);
    return query.range(offset, Number(offset) + Number(limit) - 1);
};

// searchFilter.js
export const applySearchFilter = (query, search, columnName = "name") => {
    if (search) {
        return query.ilike(columnName, `%${search}%`); // Case-insensitive search
    }
    return query;
};

// statusFilter.js
export const applyStatusFilter = (query, status, columnName = "status") => {
    if (status && status !== "all") {
        if (Array.isArray(status)) {
            return query.in(columnName, status);
        } else {
            return query.eq(columnName, status);
        }
    }
    return query;
};
