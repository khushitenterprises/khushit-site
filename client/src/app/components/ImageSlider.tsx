import { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';

interface SliderImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  link?: string;
}

const DEFAULT_SLIDER_IMAGES: SliderImage[] = [
  {
    id: 'slider-1',
    src: '/Febric%20Conditionar%20Bnner.jpg',
    alt: 'Fabric Conditioner Banner',
    title: 'Fabric Conditioner',
  },
  {
    id: 'slider-2',
    src: '/Khushit%20Shampoo%20Banner.jpg',
    alt: 'Khushit Shampoo Banner',
    title: 'Khushit Shampoo',
  },
  {
    id: 'slider-3',
    src: '/Beauti%20Soap%20Banner.jpg',
    alt: 'Beauti Soap Banner',
    title: 'Beauti Soap',
  },
  {
    id: 'slider-4',
    src: '/Airdrop%20Banner.jpg',
    alt: 'Airdrops Banner',
    title: 'Airdrops',
  },
];

export function ImageSlider() {
  const carouselApiRef = useRef<any>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const displayImages = DEFAULT_SLIDER_IMAGES;
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
                  <div className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
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
