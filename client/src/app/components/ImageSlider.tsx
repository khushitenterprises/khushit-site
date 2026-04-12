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

const codeSliderImages: SliderImage[] = [
  {
    id: 'sld_airdrop',
    src: '/airdrop-banner.jpg',
    alt: 'Airdrops banner',
    title: 'Airdrops',
    link: '/products/airdrops',
  },
  {
    id: 'sld_beauti',
    src: '/beauti-soap-banner.jpg',
    alt: 'Beauti soap banner',
    title: 'Beauti Soap',
    link: '/products/bath-soaps',
  },
  {
    id: 'sld_fabric',
    src: '/fabric-conditioner-banner.jpg',
    alt: 'Fabric conditioner banner',
    title: 'Fabric Care',
    link: '/products/fabric-conditioner',
  },
  {
    id: 'sld_shampoo',
    src: '/khushit-shampoo-banner.jpg',
    alt: 'Khushit shampoo banner',
    title: 'Khushit Shampoo',
    link: '/products/shampoo',
  },
];

export function ImageSlider() {
  const [sliderImages] = useState<SliderImage[]>(codeSliderImages);
  const [current, setCurrent] = useState(0);
  const carouselApiRef = useRef<any>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const visibleSliderImages = useMemo(() => sliderImages, [sliderImages]);

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      if (carouselApiRef.current) {
        carouselApiRef.current.scrollNext();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoplay]);

  if (visibleSliderImages.length === 0) {
    return (
      <section className="w-full px-0 mt-20 mb-0">
        <div className="w-full">
          <div className="relative w-full" style={{ aspectRatio: '16 / 6', maxHeight: '650px' }} />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-0 mt-20 mb-0">
      <div className="w-full">
        <div className="relative w-full" style={{ aspectRatio: '16 / 6', maxHeight: '650px' }}>
          <Carousel
            className="w-full h-full"
            opts={{
              loop: true,
              align: 'start',
              duration: 0,
              skipSnaps: false,
            }}
            setApi={(api: any) => {
              carouselApiRef.current = api;
              if (!api) return;
              api.on('select', () => {
                setCurrent(api.selectedScrollSnap());
              });
              api.on('pointerDown', () => {
                setIsAutoplay(false);
              });
            }}
          >
            <CarouselContent>
              {visibleSliderImages.map((image, index) => (
                <CarouselItem key={image.id}>
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
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.endsWith('/allairdrops.jpeg')) {
                          return;
                        }
                        target.src = '/allairdrops.jpeg';
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
