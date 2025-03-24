
export function pagination(request: any) {
    const page = parseInt(request.query.page || '1');
    const limit = parseInt(request.query.limit || '10');
    const where = request?.query?.where 
    const ids: number[] = where?.split(',')?.map(Number) || [];

    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset,
        ids: ids[0] === 0 ? [] : ids
    };
}

export function countPage(pages: number, limit: number) {
    return Math.ceil(Number(pages) / limit)
}