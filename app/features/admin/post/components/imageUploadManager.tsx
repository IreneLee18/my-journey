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
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageItem {
  id: string;
  url: string;
  file?: File;
}

interface ImageUploadManagerProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
}

function SortableImageItem({
  image,
  onDelete,
}: {
  image: ImageItem;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-white cursor-move group',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <img src={image.url} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="pointer-events-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ImageUploadManager({
  images,
  onImagesChange,
}: ImageUploadManagerProps) {
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

    const newImages: ImageItem[] = Array.from(files).map((file) => {
      return {
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
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

    const newImages: ImageItem[] = Array.from(files).map((file) => {
      return {
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
      };
    });

    onImagesChange([...images, ...newImages]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-gray-400'
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
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            點擊上傳或拖曳圖片到此處
          </p>
          <p className="text-sm text-gray-500">支援多選檔案</p>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
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
