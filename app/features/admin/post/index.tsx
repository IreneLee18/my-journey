import { PageLayout } from '@/components/customs/pageLayout';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Form, FormInput } from '@/components/customs/form';
import { useForm, type FieldValues } from 'react-hook-form';
import { MobileContent } from './components/contents/mobile';
import { DesktopContent } from './components/contents/desktop';
import { adminPaths } from '@/constants/paths';

interface ImageItem {
  id: string;
  url: string;
  file?: File;
}

interface PostFormValues {
  title: string;
  images: ImageItem[];
  content: string;
}

interface PostPageProps {
  type: 'create' | 'edit';
}

export default function PostPage({ type }: PostPageProps) {
  const navigate = useNavigate();
  const form = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      images: [],
      content: '',
    },
  });

  const onCancel = () => {
    return navigate('/admin/posts');
  };

  const onSubmit = (data: FieldValues) => {
    // TODO: Implement save logic
    console.log('Saving:', data);
  };

  return (
    <PageLayout
      title={type === 'create' ? 'NEW POST' : 'EDIT POST'}
      className="space-y-4"
      goBack={() => {
        return navigate(adminPaths.posts.url);
      }}
      goBackString="Go Back To Posts"
    >
      <Form {...form} onSubmit={onSubmit}>
        {/* Title Input */}
        <div className="w-full">
          <FormInput
            name="title"
            label="文章標題"
            type="text"
            placeholder="請輸入文章標題"
            className="w-full"
          />
        </div>

        <DesktopContent form={form} />
        <MobileContent form={form} />

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </Form>
    </PageLayout>
  );
}
