import { z } from 'zod';

export const registerValidationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .optional()
    .transform(val => val?.trim()),
  email: z
    .email('Invalid email address')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .transform(val => val?.trim()),
});

export const loginValidationSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().min(3).max(50).optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine(data => data.email || data.username, {
    message: 'Either email or username is required',
    path: ['identifier'],
  })
  .transform(data => ({
    identifier: data.email ?? data.username,
    password: data.password,
  }));

export const googleValidationSchema = z.object({
  email: z
    .email('Invalid email address')
    .transform(val => val.toLowerCase().trim()),
  googleId: z
    .string()
    .optional()
    .transform(val => val?.trim()),
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

export type Register = z.infer<typeof registerValidationSchema>;
export type Login = z.infer<typeof loginValidationSchema>;
export type Google = z.infer<typeof googleValidationSchema>;
