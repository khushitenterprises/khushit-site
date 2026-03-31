import { useEffect, useState } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
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
    if (displayImages.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [displayImages.length]);

  useEffect(() => {
    displayImages.forEach((image) => {
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
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={index !== currentIndex}
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
            </div>
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
