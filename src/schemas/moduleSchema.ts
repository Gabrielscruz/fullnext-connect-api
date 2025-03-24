import { z } from "zod";

export const moduleSchema = z.object({
    title: z.string(),
    defaultIcon: z.string(),
    activeIcon: z.string(),
});


export const moduleByIdSchema = z.object({
    moduleId: z.string()
})