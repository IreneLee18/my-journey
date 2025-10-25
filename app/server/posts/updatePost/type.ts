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

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '文章標題不能為空'),
  content: z.string().min(1, '文章內容不能為空'),
  publishDate: z.string().optional(),
  images: z.array(postImageInputSchema).min(1, '至少需要上傳一張照片'),
});

export type PostImageInput = z.infer<typeof postImageInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

