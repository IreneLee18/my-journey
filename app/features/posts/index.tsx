import { useState } from 'react';
import { PageLayout } from '@/components/customs/pageLayout';
import { PostCard } from './components/postCard';
import { PaginationGroup } from '@/components/customs/paginationGroup';
import { useGetPosts } from '@/server/posts/getPosts/hook';
import { useTranslation } from '@/i18n/useTranslation';

export default function PostsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ page: 1, size: 12 });

  const { data, isLoading, error } = useGetPosts({
    page: searchParams.page,
    pageSize: searchParams.size,
  });

  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newParams = { ...searchParams, size: newPageSize, page: 1 };
    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <PageLayout title={t('nav.posts')} className="flex flex-col gap-8">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('posts.loading')}</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('nav.posts')} className="flex flex-col gap-8">
        <div className="text-center py-12">
          <p className="text-red-500">{t('posts.error')}：{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  const posts = data?.data?.posts || [];
  const total = data?.data?.total || 0;

  return (
    <PageLayout title={t('nav.posts')} className="flex flex-col gap-8">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('posts.empty')}</p>
        </div>
      ) : (
        <>
          <div className="lg:min-h-[calc(100vh-25rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
              {posts.map((post) => {
                return (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      publishDate: post.publishDate,
                      image: post.images[0]?.url || '/placeholder.jpg',
                    }}
                  />
                );
              })}
            </div>
          </div>
          <PaginationGroup
            currentPage={searchParams.page}
            total={total}
            pageSize={searchParams.size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger
          />
        </>
      )}
    </PageLayout>
  );
}
