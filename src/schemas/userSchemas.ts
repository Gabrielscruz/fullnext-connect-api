import { z } from 'zod';

export const userByIdSchema = z.object({
  userId: z.string()
})

export const userCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  dateOfBirth: z.string(),
  accessControl: z.object({
    value: z.number(), label: z.string()
  }),
  about: z.string()
});

export const userUpdateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  updatePassword: z.boolean(),
  dateOfBirth: z.string(),
  accessControl: z.object({
    value: z.number(), label: z.string()
  }),
  about: z.string()
});

export const userUpdateThemeSchema =  z.object({ 
  theme: z.string()
})


export const userProfileSchema = z.object({
  name: z.string(), 
  isUpdatePassword: z.boolean(), 
  password: z.string(), 
  about: z.string()
})