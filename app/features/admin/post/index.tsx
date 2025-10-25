import { PageLayout } from '@/components/customs/pageLayout';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Form, FormInput } from '@/components/customs/form';
import { useForm, type FieldValues } from 'react-hook-form';
import { MobileContent } from './components/contents/mobile';
import { DesktopContent } from './components/contents/desktop';
import { adminPaths } from '@/constants/paths';
import { useCreatePost } from '@/server/posts/createPost/hook';
import { useUpdatePost } from '@/server/posts/updatePost/hook';
import { useGetPost } from '@/server/posts/getPost/hook';
import { useUploadImages } from '@/server/upload/hooks';
import { useEffect } from 'react';
import type { PostImageInput } from '@/server/posts/createPost/type';
import { useStatusDialogState } from '@/utils/statusDialogState';

type ImageItem = {
  id: string;
  url: string;
  file?: File;
};

type PostFormValues = {
  title: string;
  images: ImageItem[];
  content: string;
};

type PostPageProps = {
  type: 'create' | 'edit';
};

export default function PostPage({ type }: PostPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openStatusDialog } = useStatusDialogState();

  // API hooks
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const uploadImages = useUploadImages();
  const { data: postData, isLoading } = useGetPost(
    type === 'edit' ? id : undefined
  );

  const form = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      images: [],
      content: '',
    },
  });

  // 編輯模式：載入現有資料
  useEffect(() => {
    if (type === 'edit' && postData?.data?.post) {
      const post = postData.data.post;
      form.reset({
        title: post.title,
        images: post.images.map((img) => {
          return {
            id: img.id,
            url: img.url,
            // 已存在的圖片沒有 file
          };
        }),
        content: post.content || '',
      });
    }
  }, [postData, type, form]);

  const onCancel = () => {
    return navigate('/admin/posts');
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const formData = data as PostFormValues;

      // 驗證必填欄位
      if (!formData.title || formData.title.trim() === '') {
        openStatusDialog({
          title: '缺少必填欄位',
          description: '文章標題不能為空',
          status: 'error',
        });
        return;
      }

      if (!formData.content || formData.content.trim() === '') {
        openStatusDialog({
          title: '缺少必填欄位',
          description: '文章內容不能為空',
          status: 'error',
        });
        return;
      }

      if (!formData.images || formData.images.length === 0) {
        openStatusDialog({
          title: '缺少必填欄位',
          description: '至少需要上傳一張照片',
          status: 'error',
        });
        return;
      }

      // 1. 先上傳新的圖片（有 file 屬性的）
      const newImages = formData.images.filter((img) => {
        return img.file;
      });

      let uploadedImages: PostImageInput[] = [];
      if (newImages.length > 0) {
        const files = newImages.map((img) => {
          return img.file!;
        });
        const uploadResult = await uploadImages.mutateAsync(files);

        uploadedImages = uploadResult.data!.images.map((img, index) => {
          return {
            filename: img.filename,
            path: img.path,
            url: img.url,
            size: img.size,
            mimeType: img.mimeType,
            order: formData.images.findIndex((item) => {
              return item.file === files[index];
            }),
          };
        });
      }

      // 2. 組合現有圖片和新上傳的圖片
      const existingImages: PostImageInput[] = formData.images
        .filter((img) => {
          return !img.file;
        })
        .map((img, index) => {
          return {
            id: img.id,
            filename: '',
            path: '',
            url: img.url,
            size: 0,
            mimeType: '',
            order: formData.images.indexOf(img),
          };
        });

      const allImages = [...existingImages, ...uploadedImages].sort((a, b) => {
        return a.order - b.order;
      });

      // 3. 建立或更新文章
      const postData = {
        title: formData.title,
        content: formData.content,
        images: allImages,
      };
      if (type === 'create') {
        createPost(postData);
      } else if (type === 'edit' && id) {
        updatePost({ ...postData, id });
      }

      // 4. 導向文章列表
      navigate(adminPaths.posts.url);
    } catch (error) {
      console.error('儲存文章失敗:', error);
      openStatusDialog({
        title: '儲存文章失敗',
        description: error instanceof Error ? error.message : '儲存文章失敗',
        status: 'error',
      });
    }
  };

  if (type === 'edit' && isLoading) {
    return (
      <PageLayout title="EDIT POST">
        <div>載入中...</div>
      </PageLayout>
    );
  }

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
