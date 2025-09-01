import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter')
    .trim(),
  email: z
    .string()
    .email('Format email tidak valid')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter')
    
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password tidak boleh kosong')
});
