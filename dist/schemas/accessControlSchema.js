"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlByIdSchema = exports.accessControlSchema = void 0;
const zod_1 = require("zod");
exports.accessControlSchema = zod_1.z.object({
    name: zod_1.z.string(),
    links: zod_1.z.array(zod_1.z.object({
        menuLinkId: zod_1.z.number()
    }))
});
exports.AccessControlByIdSchema = zod_1.z.object({
    accessControlId: zod_1.z.string()
});
//# sourceMappingURL=accessControlSchema.js.map