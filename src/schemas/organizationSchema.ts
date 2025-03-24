import { z } from "zod";

export const organizationSchema = z.object({
    channels: z.array(z.string()),
    industries: z.array(z.string()),
    user:  z.any(),
    emails: z.array(z.object({
        value: z.string(),
        label: z.string(),
    }),),
    name: z.string()
});


export const organizationStyleSchema = z.object({
    name: z.string(),
    color: z.string() 
});


export const organizationNamechema = z.object({
    name: z.string()
});