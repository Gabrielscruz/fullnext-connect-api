import { z } from "zod";

export const powerBiCredentialByIdSchema = z.object({
    powerBiCredentialId: z.string()
})

export const powerBiCredentialSchema = z.object({
    name: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    tenantId: z.string(),
})