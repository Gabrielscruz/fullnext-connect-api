import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  tenant: z.string().optional()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  tenant: z.string()
});


export const validPasswordSchema = z.object({
  email: z.string().email(),
  tenant: z.string(),
  codigo: z.string()
});

