"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleByIdSchema = exports.moduleSchema = void 0;
const zod_1 = require("zod");
exports.moduleSchema = zod_1.z.object({
    title: zod_1.z.string(),
    defaultIcon: zod_1.z.string(),
    activeIcon: zod_1.z.string(),
});
exports.moduleByIdSchema = zod_1.z.object({
    moduleId: zod_1.z.string()
});
//# sourceMappingURL=moduleSchema.js.map