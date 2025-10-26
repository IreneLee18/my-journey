import { z } from 'zod';
import { postApiBaseSchema } from '../shared.type';

export const createPostSchema = postApiBaseSchema;
export type CreatePostType = z.infer<typeof createPostSchema>;
