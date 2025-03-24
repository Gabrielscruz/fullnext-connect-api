import { z } from "zod";

export const feedbackIdSchema = z.object({
    feedbackId: z.string(),
})

export const feedbackSchema = z.object({
    type: z.string(),
    title: z.string(),
    comment: z.string(),
  });