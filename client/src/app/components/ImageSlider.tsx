import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface SliderImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  link?: string;
}

export function ImageSlider() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '', []);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [failedImageIds, setFailedImageIds] = useState<string[]>([]);
  const carouselApiRef = useRef<any>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const displayImages = useMemo(
    () => sliderImages.filter((image) => !failedImageIds.includes(image.id)),
    [sliderImages, failedImageIds]
  );

  useEffect(() => {
    let isMounted = true;

    const loadSliders = async () => {
      try {
        const response = await fetch(`${apiBase}/api/sliders`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SliderImage[];
        if (!isMounted || !Array.isArray(data) || data.length === 0) {
          return;
        }

        const cleaned = data
          .filter((item) => item && item.id && String(item.src || '').trim() && item.title)
          .map((item) => ({
            id: String(item.id),
            src: String(item.src).trim(),
            alt: String(item.alt || item.title),
            title: String(item.title),
            link: item.link ? String(item.link) : '',
          }));

        setSliderImages(cleaned);
        setFailedImageIds([]);
      } catch {
        setSliderImages([]);
        setFailedImageIds([]);
      }
    };

    loadSliders();

    return () => {
      isMounted = false;
    };
  }, [apiBase]);

  useEffect(() => {
    if (!isAutoplay || displayImages.length < 2) return;

    const timer = setInterval(() => {
      if (carouselApiRef.current) {
        carouselApiRef.current.scrollNext();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoplay, displayImages.length]);

  useEffect(() => {
    displayImages.slice(0, 3).forEach((image) => {
      const preloadImage = new Image();
      preloadImage.decoding = 'async';
      preloadImage.src = image.src;
    });
  }, [displayImages]);

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-0 mt-20 mb-0">
      <div className="w-full">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 6', maxHeight: '650px' }}>
          <Carousel
            className="w-full h-full overflow-hidden"
            opts={{
              loop: true,
              align: 'start',
              duration: 0,
              skipSnaps: false,
            }}
            setApi={(api: any) => {
              carouselApiRef.current = api;
              if (!api) return;
              api.on('pointerDown', () => {
                setIsAutoplay(false);
              });
            }}
          >
            <CarouselContent className="h-full">
              {displayImages.map((image, index) => (
                <CarouselItem key={image.id} className="h-full">
                  <div
                    className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      draggable={false}
                      onError={(e) => {
                        setFailedImageIds((prev) => (prev.includes(image.id) ? prev : [...prev, image.id]));
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot Indicators */}
          {/* <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center gap-2 z-20">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (carouselApiRef.current) {
                    carouselApiRef.current.scrollTo(index);
                    setIsAutoplay(false);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-white w-6'
                    : 'bg-white/60 w-2 hover:bg-white/80'
                }`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
