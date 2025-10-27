import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Upload, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortableImageItem } from './sortableImageItem';
import { type PostFormImageValues } from '@/server/posts/shared.type';
import { compressImages, formatFileSize } from '@/utils/imageCompressor';

export function ImageUploadManager({
  images,
  onImagesChange,
}: {
  images: PostFormImageValues[];
  onImagesChange: (images: PostFormImageValues[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({
    current: 0,
    total: 0,
    progress: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => {
        return img.id === active.id;
      });
      const newIndex = images.findIndex((img) => {
        return img.id === over.id;
      });

      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  /**
   * 處理檔案並壓縮
   */
  const processFiles = async (fileList: FileList) => {
    const filesArray = Array.from(fileList);

    setIsCompressing(true);
    setCompressionProgress({
      current: 0,
      total: filesArray.length,
      progress: 0,
    });

    try {
      // 壓縮所有圖片
      // 使用預設配置：maxWidth: 1200, maxHeight: 1200, quality: 0.65, targetSizeKB: 500
      // 針對 iPhone 大檔案照片會自動使用更激進的壓縮策略
      const compressedFiles = await compressImages({
        files: filesArray,
        options: {
          targetSizeKB: 500, // 目標壓縮到 500KB 以下
        },
        onProgress: (progress, current, total) => {
          setCompressionProgress({ progress, current, total });
        },
      });

      // 創建 PostFormImageValues 陣列
      const newImages: PostFormImageValues[] = compressedFiles.map(
        (file, index) => {
          const originalFile = filesArray[index];
          const compressionRatio =
            originalFile.size > 0
              ? Math.round((1 - file.size / originalFile.size) * 100)
              : 0;

          console.log(
            `壓縮完成: ${file.name}\n` +
              `原始大小: ${formatFileSize(originalFile.size)}\n` +
              `壓縮後: ${formatFileSize(file.size)}\n` +
              `壓縮率: ${compressionRatio}%`
          );

          return {
            id: crypto.randomUUID(),
            filename: file.name,
            path: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            mimeType: file.type,
            order: images.length + index,
            file: file,
          };
        }
      );

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('壓縮圖片失敗:', error);
      // 如果壓縮失敗，使用原始檔案
      const newImages: PostFormImageValues[] = filesArray.map((file, index) => {
        return {
          id: crypto.randomUUID(),
          filename: file.name,
          path: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
          order: images.length + index,
          file: file,
        };
      });
      onImagesChange([...images, ...newImages]);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    await processFiles(files);
    event.target.value = '';
  };

  const handleDelete = (id: string) => {
    onImagesChange(
      images.filter((img) => {
        return img.id !== id;
      })
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    await processFiles(files);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/10 dark:bg-primary/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          isCompressing && 'pointer-events-none opacity-60'
        )}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="sr-only"
          disabled={isCompressing}
        />
        <label
          htmlFor="image-upload"
          className={cn(
            'flex flex-col items-center justify-center',
            !isCompressing && 'cursor-pointer'
          )}
        >
          {isCompressing ? (
            <>
              <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                正在壓縮圖片...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {compressionProgress.current} / {compressionProgress.total} (
                {compressionProgress.progress}%)
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                點擊上傳或拖曳圖片到此處
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支援多選檔案（自動壓縮）
              </p>
            </>
          )}
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            已上傳 {images.length} 張圖片（可拖拉排序）
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => {
                return img.id;
              })}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {images.map((image) => {
                  return (
                    <SortableImageItem
                      key={image.id}
                      image={image}
                      onDelete={() => {
                        return handleDelete(image.id);
                      }}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
