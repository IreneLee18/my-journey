import { z } from 'zod';

// API 用的圖片 Schema（傳送給後端的格式）
export const postImageInputSchema = z.object({
  id: z.string().optional(),
  filename: z.string(),
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimeType: z.string(),
  order: z.number(),
});

// 前端表單用的圖片 Schema（包含 File 物件和所有必要字段）
export const postFormImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  order: z.number(),
  file: z.instanceof(File).optional(), // 新上傳的圖片才有 file
});

// 共用的文章基礎 Schema（表單用）
export const postFormBaseSchema = z.object({
  title: z.string().min(1, '文章標題不能為空'),
  content: z.string().min(1, '文章內容不能為空'),
  images: z.array(postFormImageSchema).min(1, '至少需要上傳一張照片'),
});

// 表單 Schema（包含可選的 id，提交前再驗證）
export const postFormSchema = postFormBaseSchema.extend({
  id: z.string().optional(),
});

// API 請求用的基礎 Schema
export const postApiBaseSchema = z.object({
  title: z.string().min(1, '文章標題不能為空'),
  content: z.string().min(1, '文章內容不能為空'),
  publishDate: z.string().optional(),
  images: z.array(postImageInputSchema).min(1, '至少需要上傳一張照片'),
});

// 匯出類型
export type PostImageType = z.infer<typeof postImageInputSchema>;
export type PostFormImageValues = z.infer<typeof postFormImageSchema>;
export type PostFormValues = z.infer<typeof postFormSchema>;
export type PostApiBaseType = z.infer<typeof postApiBaseSchema>;

