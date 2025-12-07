import * as z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(255, "Name must be at most 255 characters.")
    .trim()
    .refine(
      (val) => {
        const trimmed = val.trim();
        return trimmed.length >= 2 && trimmed.split(/\s+/).length >= 1;
      },
      {
        message: "Please enter a valid full name.",
      }
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

