
import React, { useState, useEffect } from 'react';
import { SLIDES, Logo } from '../constants';
import { MapPin } from 'lucide-react';

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden text-white bg-gray-900">
      {/* Hidden pre-loader to ensure images are ready before they become 'current' */}
      <div className="hidden">
        {SLIDES.map(slide => (
          <img key={`preload-${slide.id}`} src={slide.imageUrl} alt="" />
        ))}
      </div>

      {/* Persistent Logo at Top Left */}
      <div className="absolute top-16 left-16 z-30 animate-in fade-in duration-1000">
        <Logo />
      </div>

      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Dark Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ease-linear"
            style={{ 
              backgroundImage: `url(${slide.imageUrl})`,
              transform: idx === current ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div className="absolute inset-0 bg-black/45" />
          </div>

          {/* Content Wrapper - Centered Vertically */}
          <div className="absolute inset-0 pl-24 pr-16 flex items-center">
            <div className="max-w-md animate-in slide-in-from-bottom-8 duration-1000 delay-150">
              {slide.icon === 'location' && (
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-md shadow-2xl">
                  <MapPin size={28} className="text-white" />
                </div>
              )}
              
              <h1 className="text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight text-white drop-shadow-sm">
                {slide.title}
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed font-medium drop-shadow-md">
                {slide.description}
              </p>

              {/* Indicators - Positioned Below Text */}
              <div className="mt-12 flex gap-3 items-center">
                {SLIDES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrent(dotIdx)}
                    className={`transition-all duration-500 rounded-full border border-white/10 ${
                      dotIdx === current 
                        ? 'w-10 h-1.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                        : 'w-2.5 h-1.5 bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
