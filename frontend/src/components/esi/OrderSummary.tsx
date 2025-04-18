'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { CartItem } from 'types';

export default ({
    fullHeight,
    cartItems,
    subTotal,
    taxTotal,
    flatShippingFee,
    
}: {
    fullHeight: boolean,
    cartItems: CartItem[],
    subTotal: number,
    taxTotal: number,
    flatShippingFee: number,
}) => {
    return (
        <Card className={fullHeight ? 'h-full' : ''}>
            <CardHeader>
                <CardTitle>
                    Order summary
                </CardTitle>
                <CardContent className="px-0">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Image</TableHead>
                                <TableHead className="font-bold w-1/2">Product</TableHead>
                                <TableHead className="font-bold">Item Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                cartItems.map((item, idx) => (
                                    <TableRow key={idx} className='border-b border-gray-400'>
                                        <TableCell className="relative">
                                            <img src={item.horse.thumbnailS3Link} className="h-[60px] w-auto rounded-md" />
                                        </TableCell>
                                        <TableCell>
                                            {item.product.category} - {item.product.name}
                                            <span className="ml-2 bg-main-color text-white px-2 rounded-full">{item.quantity}</span>
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
                    <div className='min-w-[200px] flex justify-end'>
                        <div className='grid grid-cols-2 gap-2 [&>div:nth-child(even)]:text-right text-gray-700'>
                            <div>
                                Subtotal
                            </div>
                            <div>
                                ${subTotal}
                            </div>
                            {
                                taxTotal > 0 && (
                                    <>
                                        <div>
                                            Tax
                                        </div>
                                        <div>
                                            ${taxTotal}
                                        </div>
                                    </>
                                )}
                            {flatShippingFee > 0 && (
                                <>
                                    <div>Shipping</div>
                                    <div>${flatShippingFee}</div>
                                </>
                            )}
                            <div className='font-bold'>
                                Order total
                            </div>
                            <div className='font-bold'>
                                ${subTotal + taxTotal + flatShippingFee}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    )
}