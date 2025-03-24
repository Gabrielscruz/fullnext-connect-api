"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPasswordSchema = exports.resetPasswordSchema = exports.authSchema = void 0;
const zod_1 = require("zod");
exports.authSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5),
    tenant: zod_1.z.string().optional()
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    tenant: zod_1.z.string()
});
exports.validPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    tenant: zod_1.z.string(),
    codigo: zod_1.z.string()
});
//# sourceMappingURL=authenticationSchemas.js.map