'use client'

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as APIs from '@/apis';


const formSchema = z.object({
    tax: z.number().min(0).max(100),
    flatShippingFee: z.number().min(0)
})

export default () => {
    const fullScreenLoader = useFullScreenLoader();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tax: 0,
            flatShippingFee: 0,
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await APIs.getTaxAndShippingFeeSetting()
                form.reset({
                    tax: response.data.tax,
                    flatShippingFee: response.data.flatShippingFee
                })
            } catch (error) {
                toast.error('Failed to fetch image setting')
            }
        }
        fetchData();
    }, [])


    const onSubmit = async (data: any) => {
        console.log('testing',data);
        fullScreenLoader.showLoader();
        try {
            await APIs.updateTaxAndShippingFeeSetting(data)
            toast.success('Tax and shipping fee setting has been updated')
        } catch (error) {
            toast.error('Failed to update tax and shipping fee setting')
        } finally {
            fullScreenLoader.hideLoader();
        }
    }

    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Tax for physical delivery</CardTitle>
                    <CardDescription>
                        Here you can make set up for the tax for physical delivery
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6'>
                <Form {...form}>
                    <form className='space-y-2'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='tax'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax rate (%)</FormLabel>
                                <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Please enter tax rate'
                                    {...field}
                                    onChange={(e) => {
                                        form.setValue(field.name, parseInt(e.target.value))
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='flatShippingFee'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Flat Shipping fee ($)</FormLabel>
                                <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Please enter shipping rate'
                                    {...field}
                                    onChange={(e) => {
                                        form.setValue(field.name, parseFloat(e.target.value))
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit">Save Settings</Button>
                    </form>
                </Form>
                
            </CardContent>
        </Card>
    )
}