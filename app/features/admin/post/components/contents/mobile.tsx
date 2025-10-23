import React from 'react';
import { ImageUploadManager } from '../imageUploadManager';
import { ArticleEditor } from '../articleEditor';
import { type UseFormReturn } from 'react-hook-form';

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

interface PostFormProps {
  form: UseFormReturn<PostFormValues>;
}

export function MobileContent({ form }: PostFormProps) {
  const images = form.watch('images');
  const content = form.watch('content');
  const onImagesChange = (images: ImageItem[]) => {
    form.setValue('images', images);
  };
  const onContentChange = (content: string) => {
    form.setValue('content', content);
  };

  return (
    <div className="lg:hidden space-y-4">
      {/* Top: Image Upload */}
      <h3 className="text-sm font-bold mb-2 text-muted-foreground">圖片管理</h3>
      <ImageUploadManager images={images} onImagesChange={onImagesChange} />

      {/* Bottom: Article Editor */}
      <h3 className="text-sm font-bold mb-2 text-muted-foreground">文章內容</h3>
      <ArticleEditor value={content} onChange={onContentChange} />
    </div>
  );
}
