'use client';
import { useMemo, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const { data: session } = useSession();

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
            street: flatShippingFee > 0 ? z.string().min(1, 'Please input the street') : z.string().optional(),
            city: flatShippingFee > 0 ? z.string().min(1, 'Please input the city') : z.string().optional(),
            state: flatShippingFee > 0 ? z.string().min(1, 'Please input the state') : z.string().optional(),
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
        street: '',
        city: '',
        state: '',
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
                    street: savedCheckoutUserInfo?.street || '',
                    city: savedCheckoutUserInfo?.city || '',
                    state: savedCheckoutUserInfo?.state || '',
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
                dataToPass['street'] = '';
                dataToPass['city'] = '';
                dataToPass['state'] = '';
                dataToPass['zipCode'] = '';
            }

            localStorage.setItem('checkoutUserInfo', JSON.stringify(data));

            const response = await APIs.createStripeCheckoutSession({
                ...dataToPass,
                cartItems: cartItems,
            }, session?.user?.accessToken)
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
        <div className='pb-3'>
            <div className="text-5xl text-main-color">
                Checkout
            </div>
            <div className="mt-5 flex flex-wrap gap-5">
                <div className='flex-1'>
                    <OrderSummary
                        fullHeight={false}
                        cartItems={cartItems}
                        subTotal={subTotal}
                        taxTotal={taxTotal}
                        flatShippingFee={flatShippingFee}
                    />
                </div>
                <div className="flex-1 min-w-[330px]">
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
                                    <div className='p-3 border rounded-md border-gray-500'>
                                    <div className='font-bold'>Shipping information</div>
                                    <FormField control={form.control} name='street'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter Street'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField control={form.control} name='city'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter City'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField control={form.control} name='state'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input type='text' placeholder='Enter State'
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
                                    </div>

                                )}
                                <div className='flex justify-end gap-3 mt-5'>
                                    <Button className='' size='lg' onClick={() => {
                                        router.back();
                                    }}>
                                        Back
                                    </Button>
                                    <Button type='submit' className='bg-main-color font-bold' size='lg'
                                        disabled={loading}>
                                        { loading && (
                                            <LoaderIcon size={18}
                                                className="animate-[spin_2s_linear_infinite] mr-2" />
                                        ) }
                                        Place order
                                    </Button>
                                </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}