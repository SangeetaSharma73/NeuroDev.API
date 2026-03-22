import { z } from 'zod';

//user schema
export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  completed: z.boolean().optional().default(false),
  priority: z.enum(['low', 'medium', 'hard']),

  dueDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  )
});
