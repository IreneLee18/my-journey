import { z } from 'zod';

export const postImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  order: z.number(),
});

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  publishDate: z.string(),
  images: z.array(postImageSchema),
});

export type PostImage = z.infer<typeof postImageSchema>;
export type Post = z.infer<typeof postSchema>;

