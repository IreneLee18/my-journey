import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: '請輸入有效的電子郵件格式' }),
  password: z.string().min(1, '請輸入密碼'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
