import { Metadata } from 'next'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Welcome to ESI',
    description: 'This is ESI horsing photo gallery'
}

export default function () {

    return (
        <div className='flex-1 flex flex-col justify-center items-center gap-8 xl:gap-20'>
            <img src="/Turnout-for-Horses.jpg" className='w-[500px] max-w-[90vw]' />
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