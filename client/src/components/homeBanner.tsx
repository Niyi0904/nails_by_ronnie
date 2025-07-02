// components/MixedMediaCarousel.tsx
'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState, useEffect, useRef} from 'react';

type Slide = {
    id: number,
  type: 'video' | 'image';
  src: string[];
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: 1,
    type: 'video',
    src: ['/videos/vid3.mp4', '/videos/vid6.mp4', '/videos/vid7.mp4', '/videos/vid1.mp4'],
    title: 'Welcome to Nailed_by_Ronnie',
    description: 'Connect with our nail technician with ease.',
  },
  {
    id: 2,
    type: 'image',
    src: ['/assets/slider2.jpg', '/assets/slider1.jpg', '/assets/slider4.jpg', '/assets/slider2.jpg'],
    title: 'Shop Nail Essentials',
    description: 'Curated tools for flawless nail care.',
  }
];

export default function MixedMediaCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 8000); // 8s per slide
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden shadow-md bg-black">
        {slides.map((slide, idx) => (
          <div
          key={idx}
          className="keen-slider__slide h-[350px] md:h-[450px] relative flex items-center justify-center"
        >
          {slide.type === "video" ? (
            <div key={slide.id} className='relative m-0 p-0 w-full h-full grid grid-flow-row grid-cols-4'>
              {slide.src.map((source, index) => (
                <Video key={index} source={source} />
              ))}
            </div>
          ) : (
            <div key={slide.id} className="relative w-full h-full grid grid-cols-4">
            {slide.src.map((source, index) => (
              <img
                key={index}
                src={source}
                alt={slide.title}
                loading='lazy'
                className="block w-full h-full object-cover"
              />
            ))}
          </div>
          )}
            <div className="absolute top-0 left-0 w-full h-full bg-transaparent bg-opacity-50 flex items-center justify-center z-10">
              <div className="relative text-center rounded-xl flex flex-col justify-center min-w-[25%] h-[30%] bg-[#F9D8DA] dark:bg-[#1E1B23]  px-4">
                <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
                <p className="text-sm md:text-base mt-2">{slide.description}</p>
              </div>
            </div>
        </div>
        ))}
      </div>
        
      {/* Dots */}
      <div className="flex justify-center mt-2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === idx ? 'bg-roseAccent' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Video({ source }: { source: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="relative w-full h-full object-cover"
    >
      <source src={source} type="video/mp4" />
    </video>
  );
}
