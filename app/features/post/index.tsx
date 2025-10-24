import { PageLayout } from '@/components/customs/pageLayout';
import { useNavigate, useParams } from 'react-router';
import { Article } from './components/article';
import { ImagesCarousel } from './components/imagesCarousel';
import { useGetPost } from '@/server/posts/getPost/hook';

export default function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading, error } = useGetPost(id);

  if (isLoading) {
    return (
      <PageLayout
        title="載入中..."
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString="Go Back To Posts"
      >
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">載入中...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="錯誤"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString="Go Back To Posts"
      >
        <div className="col-span-full text-center py-12">
          <p className="text-red-500">錯誤：{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  const post = data?.data?.post;

  if (!post) {
    return (
      <PageLayout
        title="找不到文章"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString="Go Back To Posts"
      >
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">找不到文章</p>
        </div>
      </PageLayout>
    );
  }

  const images = post.images.map((img) => {
    return img.url;
  });

  return (
    <PageLayout
      title={post.title}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
      goBack={() => { return navigate('/posts'); }}
      goBackString="Go Back To Posts"
    >
      <ImagesCarousel images={images} />
      <Article publishDate={post.publishDate} content={post.content || ''} />
    </PageLayout>
  );
}
