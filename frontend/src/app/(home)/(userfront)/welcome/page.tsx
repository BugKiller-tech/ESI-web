import { Metadata } from 'next'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Welcome to ESI',
    description: 'This is ESI horsing photo gallery'
}

export default function () {

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
        <div className='flex-1 flex flex-col md:justify-center items-center gap-5 md:gap-10 xl:gap-16'>
            <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5'>
                {images.map(image => (
                    <div>
                        <img src={image.src} className='w-full shadow-lg shadow-gray-400 border border-gray-500' />
                    </div>
                ))}
            </div>
            <div>
                <div className='text-4xl md:text-5xl xl:text-6xl text-center text-main-color'>
                    Welcome to Esi photography
                </div>
            </div>
            <div>
                <Link href={'/search-photos'}>
                    <Button size='lg' className='bg-main-color'>
                        See your photos
                    </Button>
                </Link>
            </div>
        </div>
    )
}