"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterbodySchema = exports.linkByIdSchema = void 0;
const zod_1 = require("zod");
exports.linkByIdSchema = zod_1.z.object({
    linkId: zod_1.z.string()
});
const optionsSchema = zod_1.z.object({
    value: zod_1.z.any(),
    label: zod_1.z.string(),
});
const filterSchema = zod_1.z.object({
    type: zod_1.z.number(),
    options: zod_1.z.array(optionsSchema),
    columnName: zod_1.z.string(),
    headerName: zod_1.z.string(),
});
exports.filterbodySchema = zod_1.z.object({
    filters: zod_1.z.array(filterSchema).optional(),
});
//# sourceMappingURL=filterSchemas.js.map