import { z } from "zod";

export const reportEmbedIdSchema = z.object({
    reportId: z.string()
})


export const reportQuerySchema = z.object({
    access_token: z.string()
})

export const reportEmbedShowCaseCredentialIdSchema = z.object({
    powerBiCredentialId: z.string()
})

export const reportEmbedShowCaseBodySchema =  z.object({
    href: z.string()
})