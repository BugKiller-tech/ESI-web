'use client'
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import {
    Contact,
    ShoppingCart,
    Handshake,

    Menu
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default () => {

    const router = useRouter();
    const params = useParams();
    const { weekId, horseNumber } = params;

    useEffect(() => {
    }, [])


    const goHome = () => {
        console.log('testing')
        router.push('/');
    }

    const goToCartPage = () => {
        router.push('/cart');
    }

    const goToContactUs = () => {
        router.push('/contact-us');
    }

    const goToFullfillmentPolicy = () => {
        router.push('/fullfillment-policy');
    }
    

    return (
        <div className='p-3 md:p-5 bg-white flex gap-3 shadow-gray-500/50'>
            <div className="flex items-center gap-2
                font-bold text-2xl cursor-pointer text-black"
                onClick={goHome}>
                <img src="/logo.png" className='w-24 h-auto' />
            </div>
            <div className="flex-1"></div>
            <div className='items-center gap-5 text-main-btn font-bold
                hidden md:flex'>
                <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500'
                    onClick={goToCartPage}>
                    <ShoppingCart />
                    Cart
                </div>
                <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500'
                    onClick={goToContactUs}>
                    <Contact />
                    Contact us
                </div>
                <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500'
                onClick={goToFullfillmentPolicy}>
                    <Handshake />
                    Fulfillment policy
                </div>
            </div>
            <div className='flex items-center md:hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Menu className='text-main-btn' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={goToCartPage}>
                            <div className='flex items-center text-main-btn gap-2'>
                                <ShoppingCart />
                                <span>Cart</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={goToContactUs}>
                            <div className='flex items-center text-main-btn gap-2'>
                                <Contact />
                                <span>Contact us</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={goToFullfillmentPolicy}>
                            <div className='flex items-center text-main-btn gap-2'>
                                <Handshake />
                                <span>Fullfillment policy</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}