import { redirect } from 'react-router';


export const createUserSession = async (userId: string, redirectTo: string) => {
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': `user_id=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
    },
  });
};

export const getUserId = (request: Request): string | null => {
  const cookie = request.headers.get('Cookie');
  if (!cookie) {
    return null;
  }
  
  const userIdMatch = cookie.match(/user_id=([^;]+)/);
  return userIdMatch ? userIdMatch[1] : null;
};

export const requireUserId = async (request: Request): Promise<string> => {
  const userId = getUserId(request);
  if (!userId) {
    throw redirect('/login');
  }
  return userId;
};

export const logout = async () => {
  // 清除 session cookie 並導向首頁
  return redirect('/', {
    headers: {
      'Set-Cookie': 'user_id=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    },
  });
};

