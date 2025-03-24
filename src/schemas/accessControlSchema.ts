import { z } from "zod";

export const accessControlSchema = z.object({
  name: z.string(),
  links: z.array(
    z.object({
      menuLinkId: z.number()
    })
  )
});


export const AccessControlByIdSchema = z.object({
    accessControlId: z.string()
  });
  