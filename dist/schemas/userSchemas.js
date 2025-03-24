"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileSchema = exports.userUpdateThemeSchema = exports.userUpdateSchema = exports.userCreateSchema = exports.userByIdSchema = void 0;
const zod_1 = require("zod");
exports.userByIdSchema = zod_1.z.object({
    userId: zod_1.z.string()
});
exports.userCreateSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    dateOfBirth: zod_1.z.string(),
    accessControl: zod_1.z.object({
        value: zod_1.z.number(), label: zod_1.z.string()
    }),
    about: zod_1.z.string()
});
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().optional(),
    updatePassword: zod_1.z.boolean(),
    dateOfBirth: zod_1.z.string(),
    accessControl: zod_1.z.object({
        value: zod_1.z.number(), label: zod_1.z.string()
    }),
    about: zod_1.z.string()
});
exports.userUpdateThemeSchema = zod_1.z.object({
    theme: zod_1.z.string()
});
exports.userProfileSchema = zod_1.z.object({
    name: zod_1.z.string(),
    isUpdatePassword: zod_1.z.boolean(),
    password: zod_1.z.string(),
    about: zod_1.z.string()
});
//# sourceMappingURL=userSchemas.js.map