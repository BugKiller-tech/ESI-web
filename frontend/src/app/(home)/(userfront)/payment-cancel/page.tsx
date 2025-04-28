'use client';
import { useRouter } from 'next/navigation';

import {
    Button,
} from '@/components/ui/button';

export default () => {

    const router = useRouter();

    const gotoCartPage = () => {
        router.push('/cart');
    }

    return (
        <div>
            <div className="text-3xl md:text-5xl text-main-color">You cancelled the payment</div>
            <div className="text-2xl mt-5">
                You can purchase anytime.
            </div>
            <div className="mt-5 text-center">
                <Button className='bg-main-color' onClick={ gotoCartPage }>Go to cart page</Button>
            </div>
        </div>
    )
}