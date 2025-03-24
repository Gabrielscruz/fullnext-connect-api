"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantSchema = exports.SubscriptionsSchema = void 0;
const zod_1 = require("zod");
exports.SubscriptionsSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string(),
    customerId: zod_1.z.string(),
    createAction: zod_1.z.boolean(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    subscription: zod_1.z.any()
});
exports.tenantSchema = zod_1.z.object({
    tenant: zod_1.z.string(),
});
//# sourceMappingURL=paymentSchema.js.map