'use client';

import {
    ArrowRightIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    Trash2Icon
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';

import {
    Product,
    CartItem
} from 'types';

export default () => {
    const {
        cartItems,
        subTotal,
        taxTotal,
        flatShippingFee,
        totalToPay,

        addToCart,
        reduceOneFromCart,
        clearCart,
    } = useCart();

    const router = useRouter();


    const gotoCheckoutPage = () => {
        router.push('/checkout');

    }

    const increaseQuantity = (cartItem: CartItem) => {
        addToCart(cartItem);
    }
    const decreaseQuantity = (cartItem: CartItem) => {
        reduceOneFromCart(cartItem);
    }

    const clearCartAction = () => {
        clearCart();
    }


    const renderCartItems = () => {
        return (
            <div className='pb-3'>
                <Table>
                    <TableHeader>
                        <TableRow className='text-xs md:text-base'>
                            <TableHead className="font-bold">Image</TableHead>
                            <TableHead className="font-bold w-1/2">Product</TableHead>
                            <TableHead className="font-bold">Item price</TableHead>
                            <TableHead className="font-bold">Item quantity</TableHead>
                            <TableHead className="font-bold">Item Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        cartItems.map((item, idx) => (
                            <TableRow key={idx} className='border-b border-gray-400 text-xs md:text-base'>
                                <TableCell>
                                    <img src={item.horse.thumbnailS3Link} className="h-[40px] md:h-[70px] w-auto" />
                                </TableCell>
                                <TableCell>
                                    { item.product.category } - { item.product.name }
                                </TableCell>
                                <TableCell>
                                    { item.product.price.toFixed(2) }
                                </TableCell>
                                <TableCell className=''>
                                    <div className='flex gap-3'>
                                    <MinusCircleIcon className='cursor-pointer text-gray-600' size={20}
                                        onClick={() => { decreaseQuantity(item); }} />
                                    <span className='font-bold'>{ item.quantity }</span>
                                    <PlusCircleIcon className='cursor-pointer text-gray-600' size={20}
                                        onClick={() => { increaseQuantity(item); }}/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {
                                        item.product.price * item.quantity
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
                <div className='text-center'>
                    <Button onClick={clearCartAction}>
                        <Trash2Icon size={16} className='mr-2' />
                        Clear cart
                    </Button>
                </div>
                <div className='flex justify-end'>
                    <div className='min-w-[170px] md:min-w-[300px] text-base md:text-xl'>
                        <div className='grid grid-cols-2 gap-2 [&>div:nth-child(even)]:text-right text-gray-700'>
                            <div>
                                Subtotal
                            </div>
                            <div>
                                ${subTotal.toFixed(2)}
                            </div>
                            {
                            taxTotal > 0 && (
                            <>
                                <div>
                                    Tax
                                </div>
                                <div>
                                    ${taxTotal.toFixed(2)}
                                </div>
                            </>
                            )}
                            { flatShippingFee > 0 && (
                            <>
                                <div>Shipping</div>
                                <div>${ flatShippingFee.toFixed(2) }</div>
                            </>
                            ) }
                            <div className='font-bold text-2xl'>
                                Order total
                            </div>
                            <div className='font-bold'>
                                ${ totalToPay.toFixed(2) }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-5 flex justify-end gap-3'>
                    <Button className='' size='lg' onClick={() => {
                        router.back();
                    }}>
                        Back
                    </Button>
                    <Button className='bg-main-color' size='lg' onClick={gotoCheckoutPage}>
                        Continue to checkout <ArrowRightIcon size={18} />
                    </Button>
                </div>
            </div>            
        )
    }

    return (
        <div className='mx-0 md:mx-5 lg:mx-10'>
            <div className="text-3xl md:text-5xl text-main-color mb-5">
                Cart
            </div>
            {
                cartItems.length === 0 && (
                    <div>
                        <div className="text-main-color text-3xl">
                            Cart is empty
                        </div>
                        <div className="text-2xl">
                            Please add image to cart
                        </div>
                    </div>
                )
            }
            {
                cartItems.length > 0 && renderCartItems()
            }
        </div>
    )
}