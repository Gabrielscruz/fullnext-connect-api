"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportEmbedShowCaseBodySchema = exports.reportEmbedShowCaseCredentialIdSchema = exports.reportQuerySchema = exports.reportEmbedIdSchema = void 0;
const zod_1 = require("zod");
exports.reportEmbedIdSchema = zod_1.z.object({
    reportId: zod_1.z.string()
});
exports.reportQuerySchema = zod_1.z.object({
    access_token: zod_1.z.string()
});
exports.reportEmbedShowCaseCredentialIdSchema = zod_1.z.object({
    powerBiCredentialId: zod_1.z.string()
});
exports.reportEmbedShowCaseBodySchema = zod_1.z.object({
    href: zod_1.z.string()
});
//# sourceMappingURL=reportEmbedSchema.js.map