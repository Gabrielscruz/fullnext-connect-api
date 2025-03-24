import { z } from 'zod';

export const linkByIdSchema = z.object({
    linkId: z.string()
})

export const menuLinkSchema = z.object({
    label: z.string(),
    href: z.string(),
    defaultIcon: z.string(),
    activeIcon: z.string(),
    selectedModule: z.object({
        value: z.number(), label: z.string()
    }),
    selectedCredential: z.object({
        value: z.number(),
        label: z.string(),
    }),
    selectedType: z.object({
        value: z.number(),
        label: z.string(),
    }),
});

export const linkBySearchSchema = z.object({
    searchTerm: z.string()
})

export const userLinkUsageSchema = z.object({
    menuLinkId: z.number(),
    duration: z.number(),
})