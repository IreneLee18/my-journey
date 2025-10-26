import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ImageItem } from './type';

export function SortableImageItem({
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
      className={cn(
        'relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group',
        isDragging && 'opacity-50 z-50'
      )}
    >
      {/* 可拖拽的圖片區域 */}
      <div {...listeners} className="h-full w-full cursor-move">
        <img
          src={image.url}
          alt=""
          className="h-full w-full object-cover pointer-events-none"
        />
      </div>

      {/* 刪除按鈕覆蓋層 */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className="pointer-events-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
