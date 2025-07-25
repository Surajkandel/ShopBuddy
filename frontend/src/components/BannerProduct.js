import React, { useState, useEffect, useCallback } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import image1 from '../assest/banner/image1.jpg';
// import image2 from '../assest/banner/img2.webp';
import image3 from '../assest/banner/image2.jpg';
import image4 from '../assest/banner/image4.jpg';
import image5 from '../assest/banner/image3.jpg';

const BannerProduct = () => {
  const desktopImages = [image1, image3, image5];
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === desktopImages.length - 1 ? 0 : prev + 1));
  }, [desktopImages.length]);

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? desktopImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg transition-all">
        {/* Banner Image */}
        <img
          src={desktopImages[currentIndex]}
          alt={`Promotional banner ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          loading="lazy"
        />

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous banner"
        >
          <IoIosArrowBack className="h-6 w-6" />
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next banner"
        >
          <IoIosArrowForward className="h-6 w-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {desktopImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 w-3 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to banner ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;