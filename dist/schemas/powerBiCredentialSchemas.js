"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerBiCredentialSchema = exports.powerBiCredentialByIdSchema = void 0;
const zod_1 = require("zod");
exports.powerBiCredentialByIdSchema = zod_1.z.object({
    powerBiCredentialId: zod_1.z.string()
});
exports.powerBiCredentialSchema = zod_1.z.object({
    name: zod_1.z.string(),
    clientId: zod_1.z.string(),
    clientSecret: zod_1.z.string(),
    tenantId: zod_1.z.string(),
});
//# sourceMappingURL=powerBiCredentialSchemas.js.map