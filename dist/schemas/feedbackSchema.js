"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackSchema = exports.feedbackIdSchema = void 0;
const zod_1 = require("zod");
exports.feedbackIdSchema = zod_1.z.object({
    feedbackId: zod_1.z.string(),
});
exports.feedbackSchema = zod_1.z.object({
    type: zod_1.z.string(),
    title: zod_1.z.string(),
    comment: zod_1.z.string(),
});
//# sourceMappingURL=feedbackSchema.js.map