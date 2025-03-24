import { z } from "zod";

export const linkByIdSchema = z.object({
    linkId: z.string()
})
const optionsSchema = z.object({
    value: z.any(),
    label: z.string(),
})


const filterSchema = z.object({
    type: z.number(),
    options: z.array(optionsSchema),
    columnName: z.string(),
    headerName: z.string(),
})

export const filterbodySchema = z.object({
    filters: z.array(filterSchema).optional(),
})
