import { z } from 'zod';
import { postApiBaseSchema } from '../shared.type';

// 更新文章 Schema（繼承自共用的 API Schema 並加上必填的 id）
export const updatePostSchema = postApiBaseSchema.extend({
  id: z.string().min(1, '文章 ID 不能為空'),
});

export type UpdatePostType = z.infer<typeof updatePostSchema>;
