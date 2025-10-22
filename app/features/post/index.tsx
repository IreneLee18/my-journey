import { PageLayout } from '@/components/customs/pageLayout';
import { MOCK_POST } from '@/mockdata/post';
import { useNavigate } from 'react-router';
import { Article } from './components/article';
import { ImagesCarousel } from './components/imagesCarousel';

export default function PostPage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      title={MOCK_POST.title}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
      goBack={() => navigate('/posts')}
      goBackString="Go Back To Posts"
    >
      <ImagesCarousel images={MOCK_POST.images} />
      <Article publishDate={MOCK_POST.publishDate} content={MOCK_POST.content} />
    </PageLayout>
  );
}
