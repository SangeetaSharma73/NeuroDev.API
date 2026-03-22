import { z } from 'zod';

//signup schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be atleast 2 chars'),
  email: z.string().email('Invalid Email'),
  password: z.string().min(6, 'Password must be atleast 6 chars')
});

//login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid Email'),
  password: z.string().min(6, 'Password must be atleast 6 chars')
});
