import { z } from 'zod';

export const updateValidationSchema = z.object({
  displayName: z
    .string()
    .max(100, 'Display name must be less than 100 characters')
    .optional()
    .transform(val => val?.trim()),
  profilePicture: z
    .string()
    .optional()
    .transform(val => val?.trim()),
});

export type UpdateUserBody = z.infer<typeof updateValidationSchema>;
