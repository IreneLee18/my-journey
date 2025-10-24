import { z } from 'zod';

export const postImageInputSchema = z.object({
  id: z.string().optional(),
  filename: z.string(),
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimeType: z.string(),
  order: z.number(),
});

export const createPostSchema = z.object({
  title: z.string().min(1, '文章標題不能為空'),
  content: z.string().optional(),
  publishDate: z.string().optional(),
  images: z.array(postImageInputSchema).default([]),
});

export type PostImageInput = z.infer<typeof postImageInputSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;

