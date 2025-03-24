"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLinkUsageSchema = exports.linkBySearchSchema = exports.menuLinkSchema = exports.linkByIdSchema = void 0;
const zod_1 = require("zod");
exports.linkByIdSchema = zod_1.z.object({
    linkId: zod_1.z.string()
});
exports.menuLinkSchema = zod_1.z.object({
    label: zod_1.z.string(),
    href: zod_1.z.string(),
    defaultIcon: zod_1.z.string(),
    activeIcon: zod_1.z.string(),
    selectedModule: zod_1.z.object({
        value: zod_1.z.number(), label: zod_1.z.string()
    }),
    selectedCredential: zod_1.z.object({
        value: zod_1.z.number(),
        label: zod_1.z.string(),
    }),
    selectedType: zod_1.z.object({
        value: zod_1.z.number(),
        label: zod_1.z.string(),
    }),
});
exports.linkBySearchSchema = zod_1.z.object({
    searchTerm: zod_1.z.string()
});
exports.userLinkUsageSchema = zod_1.z.object({
    menuLinkId: zod_1.z.number(),
    duration: zod_1.z.number(),
});
//# sourceMappingURL=menuLinkSchema.js.map