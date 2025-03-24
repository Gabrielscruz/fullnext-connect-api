"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilter = void 0;
const filterSchemas_1 = require("../schemas/filterSchemas");
const buildWhere_1 = require("../utils/buildWhere");
const extractFieldsFromSQL = (sqlContent) => {
    const items = sqlContent.split('jsonb_build_object');
    const fields = [];
    items.forEach((item) => {
        const indexInitColumnName = item.indexOf("'columnName',");
        const indexEndColumnName = item.indexOf("'headerName',");
        if (indexInitColumnName !== -1 && indexEndColumnName !== -1) {
            const columnName = item
                .substring(indexInitColumnName, indexEndColumnName)
                .replace("'columnName',", '')
                .trim()
                .replace(',', '')
                .replaceAll("'", '');
            if (columnName)
                fields.push(columnName);
        }
        if (item.includes("'ids'"))
            return;
        const indexInitValue = item.indexOf("'value'");
        const indexInitLabel = item.indexOf("'label'");
        const indexEndLabel = item.indexOf(")");
        if (indexInitValue !== -1 && indexInitLabel !== -1) {
            const value = item
                .substring(indexInitValue, indexInitLabel)
                .replace("'value',", '')
                .trim()
                .replace(',', '')
                .replaceAll("'", '');
            if (value)
                fields.push(value);
        }
        if (indexInitLabel !== -1 && indexEndLabel !== -1) {
            const label = item
                .substring(indexInitLabel, indexEndLabel)
                .replace("'label',", '')
                .trim()
                .replace(',', '')
                .replaceAll("'", '');
            if (label)
                fields.push(label);
        }
    });
    return Array.from(new Set(fields));
};
function separatorSelectFrom(query) {
    const regex = /SELECT(.*?)FROM/si;
    const match = query.match(regex);
    if (match) {
        return match[1].trim();
    }
    else {
        throw new Error('Invalid format or content not found.');
    }
}
const createMaterializedView = async (fields, query, viewName, request, filterEmpety) => {
    const indexFrom = query.toLocaleLowerCase().indexOf('from');
    const from = query.substring(indexFrom);
    const selectFields = fields
        .map(({ originalField, renameField }) => `${originalField} AS ${renameField}`)
        .join(",\n  ");
    const checkViewExistsQuery = `
        SELECT 1
        FROM pg_matviews
        WHERE matviewname = '${viewName}';
    `;
    const viewExists = await request.prisma.$queryRawUnsafe(checkViewExistsQuery);
    if (viewExists.length === 0) {
        const createViewQuery = `
            CREATE MATERIALIZED VIEW ${viewName} AS
            SELECT
                ${selectFields}
            ${from};
        `;
        await request.prisma.$queryRawUnsafe(createViewQuery);
    }
    else {
        console.log(`Materialized view '${viewName}' already exists.`);
    }
    if (filterEmpety) {
        const refreshQuery = `
          REFRESH MATERIALIZED VIEW ${viewName};
        `;
        await request.prisma.$queryRawUnsafe(refreshQuery);
    }
    return selectFields;
};
function processFields(contentSQL) {
    const columns = extractFieldsFromSQL(contentSQL);
    const deduplicatedColumns = columns.reduce((acc, column) => {
        const baseColumn = column.replace("::date", "").trim();
        if (!acc.has(baseColumn) || column.includes("::date")) {
            acc.set(baseColumn, column);
        }
        return acc;
    }, new Map());
    return Array.from(deduplicatedColumns.values()).map((field) => {
        const fieldIndex = field.indexOf("::date");
        const renameField = fieldIndex === -1
            ? field.toLowerCase().replaceAll('"', '').replaceAll('.', '_').trim()
            : field.toLowerCase().replaceAll('"', '').replaceAll('.', '_').replaceAll('::date', '').trim();
        return { originalField: field, renameField };
    });
}
const getFilter = async (request, reply) => {
    const { linkId } = filterSchemas_1.linkByIdSchema.parse(request.params);
    const { filters } = request.body;
    try {
        const filter = await request.prisma.filter.findFirst({
            where: {
                menuLinkId: Number(linkId)
            },
        });
        if (!filter?.instruction) {
            return reply.status(404).send({ message: "Filter not found" });
        }
        const contentSQL = separatorSelectFrom(filter?.instruction);
        const newFileds = processFields(contentSQL);
        const viewName = `view_filter_${linkId}`;
        await createMaterializedView(newFileds, filter?.instruction, viewName, request, Object.keys(filters).length === 0);
        const sqltypeColumns = `
            SELECT a.attname AS column,
                pg_catalog.format_type(a.atttypid, a.atttypmod) AS type
            FROM pg_attribute a
            JOIN pg_class c ON a.attrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relname = LOWER('${viewName}')
            AND n.nspname = 'public'
            AND a.attnum > 0
            AND NOT a.attisdropped
      `;
        const typeColumns = await request.prisma.$queryRawUnsafe(sqltypeColumns);
        const where = (0, buildWhere_1.buildClauseWhereDynamic)(filters, typeColumns);
        let query = `SELECT ${contentSQL} \n FROM ${viewName} \n ${where}`;
        newFileds.forEach(({ originalField, renameField }) => {
            query = query.replaceAll(originalField.replaceAll('::date', '').trim(), renameField);
        });
        const response = await request.prisma.$queryRawUnsafe(query);
        return reply.send(response[0]);
    }
    catch (error) {
        console.log(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
    finally {
        await request.prisma.$disconnect();
    }
};
exports.getFilter = getFilter;
//# sourceMappingURL=filterControllers.js.map