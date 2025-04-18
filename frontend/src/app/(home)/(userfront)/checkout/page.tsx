'use client';
import { useMemo, useEffect, useState } from 'react';
import { useCart } from "@/context/CartContext";
import OrderSummary from '@/components/esi/OrderSummary';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    LoaderIcon
} from 'lucide-react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as APIs from '@/apis';


export default () => {

    const [ loading, setLoading ] = useState(false);

    const {
        cartItems,
        subTotal,
        taxTotal,
        flatShippingFee,
        totalToPay,
    } = useCart();


    // Dynamically create schema based on props/state
    const formSchema = useMemo(() => {
        return z.object({
            firstName: z.string().min(1, 'Please provide your first name'),
            lastName: z.string().min(1, 'Please provide your first name'),
            email: z.string().email('Please provide the valid email'),
            phoneNumber: z.string().min(1, 'Plesae input the phone number'),
            shippingAddress: flatShippingFee > 0 ? z.string().min(1, 'Please input the shipping address')
                            : z.string().optional(),
            zipCode: flatShippingFee > 0 ? z.string().min(1, 'Please input your zip code')
                            : z.string().optional()
        });
    }, [flatShippingFee]);

    type UserFormValue = z.infer<typeof formSchema>;


    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        shippingAddress: '',
        zipCode: '',
    }
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    });

    useEffect(() => {
        const savedInfo = localStorage.getItem('checkoutUserInfo');
        if (savedInfo) {
            const savedCheckoutUserInfo = JSON.parse(savedInfo);
            if (savedCheckoutUserInfo) {
                form.reset({
                    firstName: savedCheckoutUserInfo?.firstName || '',
                    lastName: savedCheckoutUserInfo?.lastName || '',
                    email: savedCheckoutUserInfo?.email || '',
                    phoneNumber: savedCheckoutUserInfo?.phoneNumber || '',
                    shippingAddress: savedCheckoutUserInfo?.shippingAddress || '',
                    zipCode: savedCheckoutUserInfo?.zipCode || '',
                })
            }
        }
    }, [form.reset]);

    const onSubmit = async (data: UserFormValue) => {
        console.log(data);
        setLoading(true);
        try {
            let dataToPass = {
                ...data
            } 
            if (flatShippingFee == 0) {
                dataToPass['shippingAddress'] = '';
                dataToPass['zipCode'] = '';
            }

            localStorage.setItem('checkoutUserInfo', JSON.stringify(data));

            const response = await APIs.createStripeCheckoutSession({
                ...dataToPass,
                cartItems: cartItems,
            })
            if (response?.data?.url) {
                window.location.href = response?.data?.url; // redirect to Stripe                
            }
        } catch ( error ) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="text-5xl text-main-color">
                Checkout
            </div>
            <div className="mt-5 flex flex-wrap gap-5">
                <div className='flex-1'>
                    <OrderSummary
                        cartItems={cartItems}
                        subTotal={subTotal}
                        taxTotal={taxTotal}
                        flatShippingFee={flatShippingFee}
                    />
                </div>
                <div className="flex-1 min-w-[350px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className='w-full space-y-2'>
                                <FormField control={form.control} name='firstName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter your first name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name='lastName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter your last name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter your email'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name='phoneNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone number</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Enter your phone number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {flatShippingFee > 0 && (
                                    <>
                                    <FormField control={form.control} name='shippingAddress'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shipping address</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter shipping address'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField control={form.control} name='zipCode'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zip Code</FormLabel>
                                                <FormControl>
                                                    <Input type='number' placeholder='Enter your zipCode'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    </>

                                )}
                                <div className='text-right'>
                                    <Button type='submit' className='bg-main-color font-bold' size='lg'
                                        disabled={loading}>
                                        { loading && (
                                            <LoaderIcon size={18}
                                                className="animate-[spin_2s_linear_infinite] mr-2" />
                                        ) }
                                        Pay for ${ totalToPay }
                                    </Button>
                                </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}