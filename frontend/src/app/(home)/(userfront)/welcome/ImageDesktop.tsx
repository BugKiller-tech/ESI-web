'use client';
import { useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css';


export default function ({
    className
}: {
    className: string,
}) {
    const images = [
        {
            title: '',
            src: '/1.jpg',
        },
        {
            title: '',
            src: '/2.jpg',
        },
        {
            title: '',
            src: '/3.jpg',
        },
        {
            title: '',
            src: '/4.jpg',
        },
        {
            title: '',
            src: '/5.jpg',
        },
    ]

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 3, // Show 3 slides at once
            spacing: 5, // Space between slides (optional)
        },
        mode: 'free-snap', // Smooth sliding
        renderMode: 'performance', // Faster
        drag: true,
        breakpoints: {
            '(max-width: 768px)': {
                slides: { perView: 1 },
            },
        },
        created: (instance) => {
            instance.moveToIdx(0, true) // Fix for showing first set correctly
        },
        defaultAnimation: {
            duration: 4000,
            easing(t) {
                return t
            },
        }

    })

    const timer = useRef(null);

    useEffect(() => {
        if (instanceRef.current) {
            timer.current = setInterval(() => {
                instanceRef.current?.next(); // move to next slide
            }, 4000); // every 2 seconds
        }

        return () => {
            clearInterval(timer.current);
        }
    }, [instanceRef]);


    return (
        <div className={`w-full ${className}`}>
            {/* <div className='mb-5'>
                <img src="/1.jpg" className='drop-shadow-[0_7px_3px_rgba(0,0,0,0.7)]' />
            </div> */}
            <div ref={sliderRef} className="keen-slider">
                {images.map((image, index) => (
                    <div key={index} className="keen-slider__slide  mb-5">
                        {/* <img
                            src={image.src}
                            alt={`Slide ${index}`}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover', }}
                        /> */}
                        <motion.img key={image.src} src={image.src}
                            className="drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]
                            w-full h-auto"
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 4, ease: "easeOut" }}
                        // whileHover={{
                        //     scale: 1.1,        // Slightly enlarge the element
                        //     rotate: 10,        // Add a small rotation
                        //     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)', // Add shadow on hover
                        //     transition: {      // Smooth transition effect
                        //         duration: 0.5,
                        //         type: 'spring',
                        //         stiffness: 300,
                        //         // damping: 20,
                        //         damping: 10,  // lower damping = more bounce
                        //         // bounce: 0.6,  // adds extra bounce
                        //     },
                        // }}
                        >
                        </motion.img>
                    </div>
                ))}
            </div>

            {/* <img src={image.src} /> */}
            {/* <motion.img key={image.src} src={image.src}
                            className="border border-red-700 shadow-lg shadow-gray-400
                            w-full h-auto"
                            initial={{ scale: 7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 3, ease: "easeOut" }}
                        // whileHover={{
                        //     scale: 1.1,        // Slightly enlarge the element
                        //     rotate: 10,        // Add a small rotation
                        //     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)', // Add shadow on hover
                        //     transition: {      // Smooth transition effect
                        //         duration: 0.5,
                        //         type: 'spring',
                        //         stiffness: 300,
                        //         // damping: 20,
                        //         damping: 10,  // lower damping = more bounce
                        //         // bounce: 0.6,  // adds extra bounce
                        //     },
                        // }}
                        >
                        </motion.img> */}

        </div >
    )

}