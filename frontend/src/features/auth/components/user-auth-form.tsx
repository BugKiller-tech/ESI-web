'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useTopLoader } from 'nextjs-toploader';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, 'please input your password')
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const toploader = useTopLoader();
  const fullScreenLoader = useFullScreenLoader();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);


  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    // fullScreenLoader.showLoader();
    // setIsLoading(true);
    toploader.start();

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: callbackUrl ?? '/dashboard'
    });
    
    // fullScreenLoader.hideLoader();
    // setIsLoading(false);

    if (result?.error) {
      toast.error('Failed to sign in, please check your credentials');
    }
    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password...'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className='ml-auto w-full' type='submit'>
            Log in
          </Button>
        </form>
      </Form>
      {/* <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div> */}
    </>
  );
}
