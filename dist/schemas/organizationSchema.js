"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationNamechema = exports.organizationStyleSchema = exports.organizationSchema = void 0;
const zod_1 = require("zod");
exports.organizationSchema = zod_1.z.object({
    channels: zod_1.z.array(zod_1.z.string()),
    industries: zod_1.z.array(zod_1.z.string()),
    user: zod_1.z.any(),
    emails: zod_1.z.array(zod_1.z.object({
        value: zod_1.z.string(),
        label: zod_1.z.string(),
    })),
    name: zod_1.z.string()
});
exports.organizationStyleSchema = zod_1.z.object({
    name: zod_1.z.string(),
    color: zod_1.z.string()
});
exports.organizationNamechema = zod_1.z.object({
    name: zod_1.z.string()
});
//# sourceMappingURL=organizationSchema.js.map