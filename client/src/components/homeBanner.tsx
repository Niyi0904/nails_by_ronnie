'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useState, useEffect } from 'react';

type Slide = {
  id: number;
  type: 'video' | 'image';
  src: string[];
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: 1,
    type: 'video',
    src: ['/videos/vid2.mp4', '/videos/vid4.mp4'], // Show 2 videos
    title: 'Welcome to Nailed_by_Ronnie',
    description: 'Connect with our nail technician with ease.',
  },
  {
    id: 2,
    type: 'image',
    src: ['/assets/slider5.jpeg'], // Show 1 image
    title: 'Shop Nail Essentials',
    description: 'Curated tools for flawless nail care.',
  }
];

export default function MixedMediaCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    const timer = setInterval(() => instanceRef.current?.next(), 6000);
    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-full bg-black rounded-2xl">
        {slides.map((slide) => (
          <div key={slide.id} className="keen-slider__slide relative h-full w-full">
            {/* Media Grid - Logic updated here */}
            <div 
              className={`grid h-full w-full gap-0.5 ${
                slide.type === 'video' ? 'grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {slide.src.map((source, i) => (
                <div key={i} className="relative h-full w-full overflow-hidden bg-zinc-900">
                  {slide.type === 'video' ? (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="h-full w-full object-cover"
                    >
                      <source src={source} type="video/mp4" />
                    </video>
                  ) : (
                    <img 
                      src={source} 
                      alt={slide.title} 
                      className="h-full w-full object-cover transition-transform duration-[10000ms] hover:scale-110" 
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-20">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl text-white text-center max-w-md mx-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                <p className="text-sm md:text-base text-gray-200">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-[#D77A8B]' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}