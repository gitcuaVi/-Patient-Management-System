import { z } from "zod"

export const UserFormValidation = z.object({
    name: z.string()
    .min(2, "Name 2")
    .max(50, "Name 50"),
    email: z.string().email("Invalid email"),
    phone: z.string().refine((phone) => /^\d{10,15}$/.test(phone),'Invalid phone number'),

  })