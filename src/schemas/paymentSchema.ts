import { z } from "zod";

export const SubscriptionsSchema = z.object({
    subscriptionId: z.string(),
    customerId: z.string(),
    createAction: z.boolean(),
    amount: z.number(),
    currency: z.string(),
    subscription: z.any()
  });

  export const tenantSchema = z.object({
    tenant: z.string(),
  });