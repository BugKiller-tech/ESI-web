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
import { useCart } from '@/context/CartContext';

export default () => {

    const router = useRouter();
    const params = useParams();
    const { weekId, horseNumber } = params;

    const cart = useCart();

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
        <div className='bg-white shadow-lg'>
            <div className='px-3 md:container mx-auto py-2 md:py-5 flex gap-3 text-main-color'>
                <div className="flex items-center gap-2
                    font-bold text-2xl cursor-pointer text-black"
                    onClick={goHome}>
                    <img src="/white_logo1.png" className='w-16 md:w-24 h-auto' />
                </div>
                <div className="flex-1"></div>
                <div className='font-bold
                    hidden md:flex items-center gap-5'>
                    <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500'
                        onClick={goToCartPage}>
                        <ShoppingCart />
                        <div className='relative flex items-center gap-1'>
                            Cart
                            <span className="text-xs font-semibold text-white bg-main-color rounded-full px-2 py-0.5">
                                {cart.totalCount}
                            </span>
                        </div>
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
                <div className='flex items-center gap-5 md:hidden'>
                    <div className='flex items-center gap-1 cursor-pointer hover:text-blue-500'
                        onClick={goToCartPage}>
                        <ShoppingCart />
                        <div className='relative flex items-center gap-1'>
                            Cart
                            <span className="text-xs font-semibold text-white bg-main-color rounded-full px-2 py-0.5">
                                {cart.totalCount}
                            </span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Menu className='text-main-color' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={goToContactUs}>
                                <div className='flex items-center text-main-color gap-2'>
                                    <Contact />
                                    <span>Contact us</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={goToFullfillmentPolicy}>
                                <div className='flex items-center text-main-color gap-2'>
                                    <Handshake />
                                    <span>Fullfillment policy</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}