'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
];

export default function ImageSlider({
  className = '',
}: {
  className: string,
}) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      // After 3 seconds, start changing slide
      timer = setTimeout(() => {
        setIsAnimating(true); // trigger animation
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % images.length);
          setIsAnimating(false); // reset animation state
        }, 2010); // wait 2s for transition to finish
      }, 2010); // 3s of showing before starting animation
    };

    startTimer();

    return () => clearTimeout(timer);
  }, [current]); // reset timer whenever slide changes

  useEffect(() => {
    // const interval = setInterval(() => {
    //   nextSlide();
    // }, 5000); // Change image every 5 seconds
    // return () => clearInterval(interval);
  }, []);




  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // const handleSwipe = (swipePower: number) => {
  //   if (swipePower < -1000) {
  //     nextSlide();
  //   } else if (swipePower > 1000) {
  //     prevSlide();
  //   }
  // };

  // const swipeConfidenceThreshold = 10000;
  // const swipePowerCalc = (offset: number, velocity: number) => {
  //   return Math.abs(offset) * velocity;
  // };


  return (
    <div className={`relative w-full h-[50vh] overflow-hidden ${className}`}>
      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
      >
        &#8594;
      </button>

      {/* Image Transition */}
      <AnimatePresence>
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="Slider Image"
          className="absolute w-full h-full object-contain drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}


          // drag="x"
          // dragConstraints={{ left: 0, right: 0 }}
          // onDragEnd={(e, { offset, velocity }) => {
          //   const swipe = swipePowerCalc(offset.x, velocity.x);
          //   if (swipe > swipeConfidenceThreshold) {
          //     prevSlide();
          //   } else if (swipe < -swipeConfidenceThreshold) {
          //     nextSlide();
          //   }
          // }}
        />
      </AnimatePresence>
    </div>
  );
}