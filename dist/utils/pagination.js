"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = pagination;
exports.countPage = countPage;
function pagination(request) {
    const page = parseInt(request.query.page || '1');
    const limit = parseInt(request.query.limit || '10');
    const where = request?.query?.where;
    const ids = where?.split(',')?.map(Number) || [];
    const offset = (page - 1) * limit;
    return {
        page,
        limit,
        offset,
        ids: ids[0] === 0 ? [] : ids
    };
}
function countPage(pages, limit) {
    return Math.ceil(Number(pages) / limit);
}
//# sourceMappingURL=pagination.js.map