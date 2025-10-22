import { useState } from 'react';
import { PageLayout } from '@/components/customs/pageLayout';
import { MOCK_POSTS } from '@/mockdata/posts';
import { PostCard } from './components/postCard';
import { PaginationGroup } from '@/components/customs/paginationGroup';

export default function PostsPage() {
  const [searchParams, setSearchParams] = useState({ page: 10, size: 12, total: 10000 });
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newParams = { ...searchParams, size: newPageSize, page: 1 };
    setSearchParams(newParams);
  };

  return (
    <PageLayout title="Posts" className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_POSTS.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
      <PaginationGroup
        currentPage={searchParams.page}
        total={searchParams.total}
        pageSize={searchParams.size}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showSizeChanger
      />
    </PageLayout>
  );
}
