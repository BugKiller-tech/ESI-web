import { Metadata } from 'next'
import ClientPage from './clientpage';


export const metadata: Metadata = {
    title: 'Welcome to ESI',
    description: 'This is ESI horsing photo gallery'
}

export default function () {
    
    return (
        <div className='h-screen px-5 pt-5 bg-[url(/Turnout-for-Horses.jpg)] bg-no-repeat bg-center bg-cover
            flex flex-col justify-center items-center'>
            <div>
                <div className='text-5xl text-white'>
                    Welcome to ESI
                </div>
            </div>
            <div className='mt-5'>
                <ClientPage />
            </div>
        </div>
    )
}