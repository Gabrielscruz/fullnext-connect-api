"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClauseWhereDynamic = buildClauseWhereDynamic;
function buildClauseWhereDynamic(filters, typeColumns = []) {
    const typeColumnsMap = new Map(typeColumns.map(tc => [tc.column, tc.type]));
    const conditions = [];
    Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
            const valueList = values.map(v => v.value).join("', '");
            const typeColumn = typeColumnsMap.get(key);
            if (typeColumn === 'date') {
                const startValue = values[0].value;
                const endValue = values[values.length - 1].value;
                conditions.push(`${key} >= '${startValue}' AND ${key} <= '${endValue}'`);
            }
            else {
                conditions.push(`${key} IN ('${valueList}')`);
            }
        }
    });
    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
}
//# sourceMappingURL=buildWhere.js.map