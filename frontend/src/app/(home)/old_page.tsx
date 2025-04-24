import { Metadata } from 'next'
import Link from 'next/link';
import {
    GetServerSideProps
} from 'next';

export const metadata: Metadata = {
    title: 'Welcome to ESI',
    description: 'This is ESI horsing photo gallery'
}

export default function () {

    return (
        <div className='h-screen px-5 pt-5 bg-[url(/Turnout-for-Horses.jpg)] bg-no-repeat bg-center bg-cover
            flex flex-col justify-center items-center'>
            <div>
                <div className='text-4xl md:text-5xl xl:text-8xl text-white'>
                    Welcome to ESI
                </div>
            </div>
            <div className='mt-12 flex flex-col gap-5'>
                <Link href='/events/NY'
                    className='bg-main-color border-2 border-main-color py-3 px-10 text-white font-bold
                                text-2xl md:text-3xl lg:text-5xl
                                hover:scale-110 transition-all duration-300
                                hover:bg-slate-900'>
                    HITS Saugerties, NY
                </Link>
                <Link href='/events/FL'
                    className='bg-main-color border-2 border-main-color py-3 px-10 text-white font-bold
                                text-2xl md:text-3xl lg:text-5xl
                                hover:scale-110 transition-all duration-300
                                hover:bg-slate-900'>
                    HITS Ocala, FL
                </Link>
            </div>
        </div>
    )
}