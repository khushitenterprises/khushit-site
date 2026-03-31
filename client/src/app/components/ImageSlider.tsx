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
  const carouselApiRef = useRef<any>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const displayImages = useMemo(() => sliderImages, [sliderImages]);
  const brokenImagePlaceholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="480" viewBox="0 0 1280 480">
        <rect width="1280" height="480" fill="#f3f4f6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="36" font-family="Arial, sans-serif">
          Slider image not available
        </text>
      </svg>`
    );
  const apiCandidates = useMemo(() => {
    const candidates = new Set<string>();
    candidates.add(apiBase);
    candidates.add('');

    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const protocol = window.location.protocol || 'http:';
      const host = window.location.hostname || 'localhost';
      for (let port = 5000; port <= 5010; port += 1) {
        candidates.add(`${protocol}//${host}:${port}`);
      }
    }

    return Array.from(candidates);
  }, [apiBase]);

  useEffect(() => {
    let isMounted = true;

    const loadSliders = async () => {
      try {
        let data: SliderImage[] = [];
        let loaded = false;

        for (const base of apiCandidates) {
          try {
            const response = await fetch(`${base}/api/sliders`);
            if (!response.ok) {
              continue;
            }

            const nextData = (await response.json()) as SliderImage[];
            if (Array.isArray(nextData)) {
              data = nextData;
              loaded = true;
              break;
            }
          } catch {
            continue;
          }
        }

        if (!loaded || !isMounted || data.length === 0) {
          return;
        }

        const cleaned = data
          .map((item, index) => {
            const src = String(
              (item as any)?.src || (item as any)?.image || (item as any)?.url || (item as any)?.photo || ''
            ).trim();
            const title = String((item as any)?.title || (item as any)?.alt || `Slider ${index + 1}`).trim();
            return {
              id: String((item as any)?.id || `slider-${index + 1}`),
              src,
              alt: String((item as any)?.alt || title),
              title,
              link: (item as any)?.link ? String((item as any).link) : '',
            };
          })
          .filter((item) => item.src);

        setSliderImages(cleaned);
      } catch {
        console.error('Unable to load sliders from API');
        setSliderImages([]);
      }
    };

    loadSliders();

    return () => {
      isMounted = false;
    };
  }, [apiCandidates]);

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
                      onError={(event) => {
                        const element = event.currentTarget;
                        if (element.src === brokenImagePlaceholder) {
                          return;
                        }
                        element.src = brokenImagePlaceholder;
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
