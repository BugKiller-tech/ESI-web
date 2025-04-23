'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import * as APIs from '@/apis';


const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Product name must be at least 2 characters.'
    }),
    // category: z.string(),
    category: z.string().refine((value) => value.length > 0, {
        message: 'Category is required'
    }),
    price: z.number().refine((value) => value > 0, {
        message: 'Price must be greater than 0'
    }),
    description: z.string(),
    isDigitalProduct: z.boolean(),
});

export default function ProductForm({
    initialData,
    pageTitle,
    isForUpdate,
}: {
    initialData: Product | null;
    pageTitle: string;
    isForUpdate: boolean;
}) {
    const { data: session } = useSession();

    const [ categories, setCategories ] = useState([]);
    const [ isPending, startTransition ] = useTransition();

    useEffect(() => {
        const fetchData = async () => {
            const response = await APIs.getProductCategories(session?.user?.accessToken);
            if (response) {
                setCategories(response.data.categories);
            }
        };
        fetchData();
    }, []);


    const defaultValues = {
        _id: initialData?.id || '',
        name: initialData?.name || '',
        category: initialData?.category || '',
        price: initialData?.price || 0,
        description: initialData?.description || '',
        isDigitalProduct: initialData?.isDigitalProduct ? true : false
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: defaultValues
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        startTransition(async () => {
            try {
                if (initialData) {
                    await APIs.updateProduct(initialData._id as string, values, session?.user?.accessToken);
                    toast.success('Successfully updated');
                } else {
                    await APIs.createProduct(values);
                    toast.success('Successfully created');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to save product');
            }
        })
    }

    return (
        <Card className='mx-auto w-full'>
            <CardHeader>
                <CardTitle className='text-left text-2xl font-bold'>
                    {pageTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter product name' {...field}  />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select categories' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                { categories.map((category, idx) => (
                                                    <SelectItem value={category} key={idx}>
                                                        { category }
                                                    </SelectItem>
                                                )) }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='Enter price'
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(Number(e.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isDigitalProduct'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Is digital product?</FormLabel>
                                        <FormControl className='flex h-9 justify-start items-center w-full'>
                                            <div>
                                                <Checkbox
                                                    checked={field.value}
                                                    onClick={(e) => {
                                                        console.log('testing', e);
                                                        field.onChange(!field.value)
                                                    }}
                                                 />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Enter product description'
                                            className='resize-none'
                                            {...field}
                                            cols={8}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>
                            { isForUpdate ? 'Update Product' : 'Add Product' }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
