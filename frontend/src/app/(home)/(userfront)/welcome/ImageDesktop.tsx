'use client';
import { motion } from "framer-motion";


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
        }
    ]


    return (
        <div className={`w-full grid-cols-1 md:grid-cols-3 gap-2 md:gap-5
                ${className}`}>
            {images.map(image => (
                // <img src={image.src} className='w-full shadow-lg shadow-gray-400 border border-gray-500' />
                <motion.img key={image.src} src={image.src}
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
                </motion.img>
            ))}
        </div>
    )

}