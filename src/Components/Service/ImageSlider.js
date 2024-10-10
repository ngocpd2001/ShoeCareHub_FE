import React, { useState, useEffect } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';  

const ImageSlider = ({ images }) => {  
  const [currentIndex, setCurrentIndex] = useState(0);  

  const nextSlide = () => {  
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  
  };  

  const prevSlide = () => {  
    setCurrentIndex((prevIndex) =>  
      prevIndex === 0 ? images.length - 1 : prevIndex - 1  
    );  
  };  

  // Tự động chuyển slide sau mỗi 3 giây  
  useEffect(() => {  
    const interval = setInterval(() => {  
      nextSlide();  
    }, 3000);  

    // Dọn dẹp interval khi component unmount  
    return () => clearInterval(interval);  
  }, []);  

  return (  
    <div className="relative w-full overflow-hidden py-8">  
      <div  
        className="flex transition-transform duration-500"  
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}  
      >  
        {images.map((image, index) => (  
          <div key={index} className="min-w-full">  
            <img  
              src={image}  
              alt={`Slide ${index + 1}`}  
              className="w-full h-full object-cover"  
            />  
          </div>  
        ))}  
      </div>  
      {/* <button  
        onClick={prevSlide}  
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"  
      >  
        <FontAwesomeIcon icon={faChevronLeft} />  
      </button>  
      <button  
        onClick={nextSlide}  
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"  
      >  
        <FontAwesomeIcon icon={faChevronRight} />  
      </button>   */}
    </div>  
  );  
};  

export default ImageSlider;