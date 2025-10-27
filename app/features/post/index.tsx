import { PageLayout } from '@/components/customs/pageLayout';
import { useNavigate, useParams } from 'react-router';
import { Article } from './components/article';
import { ImagesCarousel } from './components/imagesCarousel';
import { useGetPost } from '@/server/posts/getPost/hook';
import { useTranslation } from '@/i18n/useTranslation';

export default function PostPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading, error } = useGetPost(id);

  if (isLoading) {
    return (
      <PageLayout
        title={t('post.loading')}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString={t('post.goBack')}
      >
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('post.loading')}</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title={t('post.error')}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString={t('post.goBack')}
      >
        <div className="col-span-full text-center py-12">
          <p className="text-red-500">{t('post.error')}：{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  const post = data?.data?.post;

  if (!post) {
    return (
      <PageLayout
        title={t('post.notFound')}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        goBack={() => { return navigate('/posts'); }}
        goBackString={t('post.goBack')}
      >
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('post.notFound')}</p>
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
      goBackString={t('post.goBack')}
    >
      <ImagesCarousel images={images} />
      <Article publishDate={post.publishDate} content={post.content || ''} />
    </PageLayout>
  );
}
