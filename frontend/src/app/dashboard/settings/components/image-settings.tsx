'use client'

import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    thumbnailSize: z.number({ message: 'Please pick right value for thee thumbnail size' }).min(1).max(100),
    thumbWebSize: z.number({ message: 'Please pick right value for thee thumbnail size' }).min(1).max(100)
});

type ImageSettingFormValue = z.infer<typeof formSchema>;

export default () => {
    const [ loadingForSave, startTransitionForSave ] = useTransition();
    const form = useForm<ImageSettingFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            thumbnailSize: 20,
            thumbWebSize: 40
        }
    });

    const onSubmit = async (data: ImageSettingFormValue) => {
        startTransitionForSave(async () => {
            console.log(data);
            try {
                const response = await APIs.saveImageProcessSetting(data)
                console.log(response);
                toast.success('Successfully updated')
            } catch (e) {
                toast.error('fail');
            }

        })
    };

    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Image process settings</CardTitle>
                    <CardDescription>
                        Here you can setup all settings for image processing
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6'>
                <Form {...form}>
                    <form className='space-y-2'
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='thumbnailSize'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbnail Size (%)</FormLabel>
                                <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Please enter thumbnail size in percentage'
                                    disabled={loadingForSave}
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='thumbWebSize'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbweb Size (%)</FormLabel>
                                <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Please enter thumbweb size in percentage'
                                    disabled={loadingForSave}
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loadingForSave} >Save Settings</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}