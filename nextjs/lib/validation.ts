import { z } from "zod"

export const UserFormValidation = z.object({
  name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().refine(
      (phone) => /^(\+?\d{10,15})$/.test(phone),
      "Phone number must be between 10 and 15 digits"
  ),
});
