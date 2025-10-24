import { z } from 'zod';

export const deletePostSchema = z.object({
  id: z.string().min(1, '文章 ID 不能為空'),
});

export type DeletePostInput = z.infer<typeof deletePostSchema>;

