import { z } from 'zod';

export const postImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  order: z.number(),
});

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  publishDate: z.string(),
  images: z.array(postImageSchema),
});

export const postsQuerySchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
});

export type PostImage = z.infer<typeof postImageSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostsQuery = z.infer<typeof postsQuerySchema>;

