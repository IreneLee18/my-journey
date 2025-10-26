import { data } from 'react-router';
import { prisma } from '@/lib/prisma.server';

export const loader = async () => {
  try {
    // 测试数据库连接
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    
    return data({
      success: true,
      status: 'healthy',
      database: 'connected',
      data: {
        users: userCount,
        posts: postCount,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        hasDirectDatabase: !!process.env.DIRECT_DATABASE_URL,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return data({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        hasDirectDatabase: !!process.env.DIRECT_DATABASE_URL,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
};

