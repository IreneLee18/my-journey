import { useEffect, useState, forwardRef } from 'react';
import { Edit, Loader, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FileUploadProps
  extends Omit<React.ComponentProps<'input'>, 'value'> {
  label?: string;
  value?: File | null;
  imageSrc?: string;
}

// 添加浮水印到圖片的函數
const addWatermarkToImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('無法創建 canvas context'));
      return;
    }

    img.onload = () => {
      // 設定 canvas 尺寸與原圖相同
      canvas.width = img.width;
      canvas.height = img.height;

      // 繪製原圖
      ctx.drawImage(img, 0, 0);

      // 設定浮水印樣式
      const fontSize = Math.min(img.width, img.height) * 0.2; // 根據圖片大小調整字體大小
      ctx.font = `bold ${fontSize.toString()}px Arial`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 半透明白色
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // 半透明黑色邊框
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 在圖片中央繪製 "Confidential" 文字
      const centerX = img.width / 2;
      const centerY = img.height / 2;
      
      // 先繪製邊框，再繪製文字
      ctx.strokeText('Confidential', centerX, centerY);
      ctx.fillText('Confidential', centerX, centerY);
      

      // 將 canvas 轉換為 Blob，再轉換為 File
      canvas.toBlob((blob) => {
        if (blob) {
          const watermarkedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(watermarkedFile);
        } else {
          reject(new Error('無法創建浮水印圖片'));
        }
      }, file.type);
    };

    img.onerror = () => {
      reject(new Error('圖片載入失敗'));
    };

    // 讀取圖片
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        img.src = e.target.result;
      }
    };
    reader.onerror = () => {
      reject(new Error('檔案讀取失敗'));
    };
    reader.readAsDataURL(file);
  });
};

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ value, onChange, imageSrc, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<{
      src: string;
    } | null>(imageSrc ? { src: imageSrc } : null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 如果是圖片檔案，進行浮水印處理
      if (file.type.includes('image')) {
        setIsLoading(true);
        addWatermarkToImage(file)
          .then((watermarkedFile) => {
            // 創建一個新的事件對象，包含處理後的檔案
            const newEvent = {
              ...event,
              target: {
                ...event.target,
                files: [watermarkedFile] as unknown as FileList,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            
            onChange?.(newEvent);
          })
          .catch(() => {
            // 如果處理失敗，使用原始檔案
            onChange?.(event);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // 非圖片檔案直接處理
        onChange?.(event);
      }
    };

    const renderUploadFile = () => {
      

      if (isLoading) {
        return <Loader className="h-12 w-12 animate-spin text-gray-400" />;
      }

      if (image) {
        return (
          <img
            src={image.src}
            alt="file"
            className="h-full max-w-full object-contain"
          />
        );
      }
      if (!value) {
        return <Upload className="h-12 w-12 text-gray-400" />;
      }
      return <p className="text-lg font-bold text-gray-500">{value.name}</p>;
    };

    useEffect(() => {
      if (value?.type.includes('image')) {
        setIsLoading(true);
        // value is a Image File type, create a fileReader to get the width and height
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const img = new window.Image();
          if (fileReader.result && typeof fileReader.result === 'string') {
            img.src = fileReader.result;
            img.onload = () => {
              setImage({ src: img.src });
              setIsLoading(false);
            };
          }
        };
        fileReader.readAsDataURL(value);
      } else {
        setImage(imageSrc ? { src: imageSrc } : null);
      }
    }, [value, imageSrc]);

    return (
      <div
        className={cn(
          'h-full max-h-[15rem] rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center transition-colors hover:border-gray-400',
          props.disabled ? 'cursor-not-allowed opacity-50' : '',
          props.className,
        )}
      >
        <div className="relative h-full flex flex-col items-center justify-center gap-4">
          <Label
            data-slot="form-label"
            className={cn(
              'text-primary cursor-pointer text-2xl font-bold',
              image ?? value ? 'absolute right-0 top-0' : '',
            )}
            htmlFor={props.name}
          >
            {value ?? imageSrc ? (
              <div className="bg-secondary flex items-center justify-center rounded-full p-2">
                <Edit className="size-6 text-gray-400" />
              </div>
            ) : (
              (props.label ?? '請上傳檔案')
            )}
          </Label>

          {renderUploadFile()}

          <Input
            {...props}
            ref={ref}
            type="file"
            id={props.name}
            name={props.name}
            accept={props.accept ?? 'image/*'}
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';
