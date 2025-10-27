import { PageLayout } from '@/components/customs/pageLayout';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Form, FormInput } from '@/components/customs/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MobileContent } from './components/contents/mobile';
import { DesktopContent } from './components/contents/desktop';
import { adminPaths } from '@/constants/paths';
import { useCreatePost } from '@/server/posts/createPost/hook';
import { useUpdatePost } from '@/server/posts/updatePost/hook';
import { useGetPost } from '@/server/posts/getPost/hook';
import { useUploadImages } from '@/server/upload/hooks';
import { useEffect } from 'react';
import {
  postFormSchema,
  type PostFormValues,
  type PostImageType,
} from '@/server/posts/shared.type';
import { useStatusDialogState } from '@/utils/statusDialogState';

type PostPageProps = {
  type: 'create' | 'edit';
};

export default function PostPage({ type }: PostPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openStatusDialog } = useStatusDialogState();

  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const uploadImages = useUploadImages();
  const { data: postData, isLoading } = useGetPost(
    type === 'edit' ? id : undefined
  );

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      images: [],
      content: '',
      id: undefined,
    },
  });

  // 編輯模式：載入現有資料
  useEffect(() => {
    if (type === 'edit' && postData?.data?.post) {
      const post = postData.data.post;
      form.reset({
        id: post.id,
        title: post.title,
        images: post.images.map((img) => {
          return {
            id: img.id,
            url: img.url,
            filename: img.filename,
            path: 'path' in img ? img.path : '',
            size: 'size' in img ? img.size : 0,
            mimeType: 'mimeType' in img ? img.mimeType : '',
            order: img.order,
            // 已存在的圖片沒有 file 物件
          };
        }),
        content: post.content || '',
      });
    }
  }, [postData, type, form]);

  const onCancel = () => {
    return navigate('/admin/posts');
  };

  const onSubmit = async (formData: PostFormValues) => {
    try {
      // 提交前驗證：編輯模式必須有 id
      if (type === 'edit') {
        if (!formData.id || !id) {
          openStatusDialog({
            title: '缺少必填欄位',
            description: '編輯文章時必須提供文章 ID',
            status: 'error',
          });
          return;
        }
      }

      // 1. 先上傳新的圖片（有 file 屬性的）
      const newImages = formData.images.filter((img) => {
        return img.file;
      });

      let uploadedImages: PostImageType[] = [];
      if (newImages.length > 0) {
        const files = newImages.map((img) => {
          return img.file!;
        });
        const uploadResult = await uploadImages.mutateAsync(files);

        uploadedImages = uploadResult.data!.images.map((img, index) => {
          return {
            id: crypto.randomUUID(),
            filename: img.filename,
            path: img.path,
            url: img.url,
            size: img.size,
            mimeType: img.mimeType,
            order: index,
          };
        });
      }

      // 2. 組合現有圖片和新上傳的圖片
      const existingImages: PostImageType[] = formData.images
        .filter((img) => {
          return !img.file;
        })
        .map((img) => {
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
      const postPayload = {
        title: formData.title,
        content: formData.content,
        images: allImages,
      };

      if (type === 'create') {
        createPost(postPayload);
      } else if (type === 'edit' && id) {
        updatePost({ ...postPayload, id });
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
      <PageLayout title="編輯文章">
        <div>載入中...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={type === 'create' ? '建立文章' : '編輯文章'}
      className="space-y-4"
      goBack={() => {
        return navigate(adminPaths.posts.url);
      }}
      goBackString="返回文章列表"
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

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">儲存</Button>
        </div>
      </Form>
    </PageLayout>
  );
}
