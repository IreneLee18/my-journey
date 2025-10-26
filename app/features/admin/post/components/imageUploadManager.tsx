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
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortableImageItem } from './sortableImageItem';
import { type PostFormImageValues } from '@/server/posts/shared.type';

export function ImageUploadManager({
  images,
  onImagesChange,
}: {
  images: PostFormImageValues[];
  onImagesChange: (images: PostFormImageValues[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: PostFormImageValues[] = Array.from(files).map((file, index) => {
      return {
        id: crypto.randomUUID(),
        filename: file.name,
        path: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        order: images.length + index,
        file: file, // 保留 file 對象用於上傳
      };
    });

    onImagesChange([...images, ...newImages]);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    const newImages: PostFormImageValues[] = Array.from(files).map((file, index) => {
      return {
        id: crypto.randomUUID(),
        filename: file.name,
        path: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        mimeType: file.type,
        order: images.length + index,
        file: file, // 保留 file 對象用於上傳
      };
    });

    onImagesChange([...images, ...newImages]);
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
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        )}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="sr-only"
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            點擊上傳或拖曳圖片到此處
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            支援多選檔案
          </p>
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
