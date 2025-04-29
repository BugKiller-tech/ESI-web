'use client';
// import { Metadata } from 'next'
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ImageDesktop from './ImageDesktop';
import ImageSlider from './ImageSlider';


// export const metadata: Metadata = {
//     title: 'Welcome to ESI',
//     description: 'This is ESI horsing photo gallery'
// }

export default function () {

   
    return (
        <div className='flex-1 flex flex-col mt-3 md:mt-10 items-center gap-2 md:gap-10 xl:gap-12'> 
                {/* md:justify-center */}
            <ImageDesktop className='hidden md:grid' />
            <ImageSlider className='block md:hidden' />
            {/* <ImageSlider /> */}
            <div>
                <div className='text-2xl md:text-5xl xl:text-6xl text-center text-main-color'>
                    Welcome to ESI Photography
                </div>
            </div>
            <div>
                <Link href={'/search-photos'}>
                    <Button size='lg' className='bg-main-color text-xl md:text-2xl font-bold'>
                        See Your Photos
                    </Button>
                </Link>
            </div>
            <div className='flex-1 w-full flex items-end justify-end'>
                <a target='_blank' href='https://www.instagram.com/esi_photography' className='cursor-pointer'>
                    <img src="/icons/instagram.svg" width={'30px'} />
                </a>
            </div>
        </div>
    )
}