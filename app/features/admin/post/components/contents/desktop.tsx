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

export function DesktopContent({ form }: PostFormProps) {
  const images = form.watch('images');
  const content = form.watch('content');
  const onImagesChange = (images: ImageItem[]) => {
    form.setValue('images', images);
  };
  const onContentChange = (content: string) => {
    form.setValue('content', content);
  };
  return (
    <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:h-[calc(100vh-22rem)] lg:overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden">
        <h3 className="text-sm font-bold mb-2 text-muted-foreground">
          圖片管理
        </h3>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <ImageUploadManager images={images} onImagesChange={onImagesChange} />
        </div>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <h3 className="text-sm font-bold mb-2 text-muted-foreground">
          文章內容
        </h3>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <ArticleEditor value={content} onChange={onContentChange} />
        </div>
      </div>
    </div>
  );
}
