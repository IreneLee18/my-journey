import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type ImagesCarouselProps = {
  images: string[];
}

export function ImagesCarousel({ images }: ImagesCarouselProps) {
  const [imageApi, setImageApi] = useState<CarouselApi>();
  const [currentImage, setCurrentImage] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (!imageApi) {
      return;
    }

    setTotalImages(imageApi.scrollSnapList().length);
    setCurrentImage(imageApi.selectedScrollSnap() + 1);

    imageApi.on('select', () => {
      setCurrentImage(imageApi.selectedScrollSnap() + 1);
    });
  }, [imageApi]);

  const scrollTo = (index: number) => {
    return () => {
      imageApi?.scrollTo(index);
    };
  };

  return (
    <div className="w-full">
      <Carousel setApi={setImageApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => {
            return (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={scrollTo(index)}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Thumbnails and Page Total Images Counter */}
      <div className="mt-4 space-y-4">
        {/* Page Total Images Counter */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {currentImage} / {totalImages}
        </div>

        {/* Thumbnails Preview */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            return (
              <button
                key={index}
                onClick={scrollTo(index)}
                className={cn(
                  'relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all hover:opacity-100',
                  currentImage === index + 1
                    ? 'border-primary opacity-100'
                    : 'border-gray-300 opacity-60'
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
