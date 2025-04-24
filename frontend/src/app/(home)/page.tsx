import { Metadata } from 'next'
import Link from 'next/link';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
    title: 'Welcome to ESI',
    description: 'This is ESI horsing photo gallery'
}

export default function () {

    redirect('/welcome');

    return (
        <div>loading</div>
    )
}