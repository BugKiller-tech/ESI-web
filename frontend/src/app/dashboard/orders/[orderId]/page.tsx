'use client';
import { useSession } from 'next-auth/react';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Suspense, useEffect, useState } from 'react';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import * as APIs from '@/apis';
import { Order } from 'types';
import OrderSummary from '@/components/esi/OrderSummary';
import OrderStatus from '@/components/esi/OrderStatus';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import './style.scss';

export default () => {

    const router = useRouter();
    const params = useParams();
    const { orderId } = params;

    const fullScreenLoader = useFullScreenLoader();
    const { data: session } = useSession();

    const [order, setOrder] = useState<Order | null>(null);

    const [newOrderStatus, setNewOrderStatus] = useState('');


    const fetchOrder = async () => {
        fullScreenLoader.showLoader();
        try {
            const response = await APIs.getOneOrder(orderId as string, session?.user?.accessToken);
            let od: Order = response.data?.order;
            if (od) {
                setOrder(od);
                setNewOrderStatus(od.orderStatus);
            }
        } catch (error) {
            console.log('failed to load order');
        } finally {
            fullScreenLoader.hideLoader();
        }
    }
    useEffect(() => {
        fetchOrder();
    }, [orderId]);


    const updateOrderStatus = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.updateOrderStatus({
                orderId: orderId,
                orderStatus: newOrderStatus,
            }, session?.user?.accessToken)
            let od: Order = response.data?.order;
            if (od) {
                setOrder(od);
                toast.success('Successfully updated order status');
            }
        } catch (error) {
            console.log(error);
        } finally {
            fullScreenLoader.hideLoader();
        }
    }

    const refundOrderAction = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.refundForOrderByAdmin(orderId as string, session?.user?.accessToken);
            if (response.data) {
                let od: Order = response.data?.order;
                setOrder(od);
                toast.success('Successfully refunded the order');
            }

        } catch (error) {
            console.log(error);
            toast.error('Failed to refund the order');
        } finally {
            fullScreenLoader.hideLoader();
        }
    }

    const downloadImages = async () => {
        try {
            toast.info('Preparing the download..');
            fullScreenLoader.showLoader();
            const response = await APIs.downloadImagesZipForOrder(order._id, session?.user?.accessToken);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Order_${order._id}_images.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.info('Download is completed.');

        } catch (error) {
            console.log(error);
            toast.error('Failed to download');
        } finally {
            fullScreenLoader.hideLoader();
        }
    }


    const downloadInvoicePDF = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.downloadInvoiceForOrder(order._id, session?.user?.accessToken);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Order_${order._id}.pdf`); // Name the downloaded file
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading the file', error);
        } finally {
            fullScreenLoader.hideLoader();
        }

    }



    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                    <Heading
                        title='Order details'
                        description='Here you can see order details and change the status'
                    />
                </div>
                <Separator />
                {order && (
                    <div className='flex flex-wrap gap-5'>
                        <div className='flex-1 min-w-[350px]'>
                            <OrderSummary
                                fullHeight={true}
                                cartItems={order.cartItems}
                                subTotal={order.subTotal}
                                taxTotal={order.taxAmount}
                                flatShippingFee={order.shippingFee}
                            />
                        </div>
                        <div className='flex-1 min-w-[350px]'>
                            <Card className='h-full'>
                                <CardHeader>
                                    <CardTitle>
                                        Customer Information
                                    </CardTitle>
                                    <CardContent className="px-0 pt-5">
                                        <table className='ordered-user-info-table'>
                                            <tbody>
                                                <tr>
                                                    <td>Fisrt name </td>
                                                    <td>{order.firstName}</td>
                                                </tr>
                                                <tr>
                                                    <td>last name</td>
                                                    <td>{order.lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td>Customer email</td>
                                                    <td>{order.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone number</td>
                                                    <td>{order.phoneNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping address</td>
                                                    <td>{order.shippingAddress}</td>
                                                </tr>
                                                <tr>
                                                    <td>Zip code</td>
                                                    <td>{order.zipCode}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payment status</td>
                                                    <td>{order.paymentStatus}</td>
                                                </tr>
                                                <tr>
                                                    <td>Order status</td>
                                                    <td>
                                                        <OrderStatus orderStatus={order.orderStatus} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className='flex-1 min-w-[350px]'>
                            <Card className='h-full'>
                                <CardHeader>
                                    <CardTitle>
                                        Manage Order
                                    </CardTitle>
                                    <CardContent className='px-0 flex flex-col gap-5'>
                                        <div>
                                            Update order status
                                        </div>
                                        <Select
                                            value={newOrderStatus}
                                            onValueChange={(v) => setNewOrderStatus(v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Please select order to update'></SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='New'>New</SelectItem>
                                                <SelectItem value='Processing'>Processing</SelectItem>
                                                <SelectItem value='Shipped'>Shipped/Completed</SelectItem>
                                                <SelectItem value='Refunded'>Refunded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button className='bg-main-color' onClick={updateOrderStatus}
                                            disabled={order.orderStatus == newOrderStatus}>
                                            Update
                                        </Button>
                                        <Separator></Separator>
                                        <Button className='bg-main-color' onClick={refundOrderAction}
                                            disabled={order.orderStatus == 'Refunded' || order.paymentStatus == 'refunded'}>
                                            Refund
                                        </Button>
                                        <Separator></Separator>
                                        <div>
                                            Download images
                                        </div>
                                        <Button className='bg-main-color' onClick={downloadImages}>
                                            Download images
                                        </Button>

                                        <Separator></Separator>
                                        <div>
                                            Download invoice PDF
                                        </div>
                                        <Button className='bg-main-color' onClick={downloadInvoicePDF}>
                                            Download pdf
                                        </Button>
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}