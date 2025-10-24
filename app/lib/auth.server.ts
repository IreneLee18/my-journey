import { prisma } from './prisma.server';

export type LoginResult = 
  | { success: true; userId: string }
  | { success: false; error: string };

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: '帳號或密碼錯誤' };
    }

    if (password !== user.password) {
      return { success: false, error: '帳號或密碼錯誤' };
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: '登入時發生錯誤，請稍後再試' };
  }
};

export const createUser = async (
  email: string,
  password: string
): Promise<{ success: true; userId: string } | { success: false; error: string }> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: '此電子郵件已被使用' };
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: '創建帳號時發生錯誤，請稍後再試' };
  }
};

