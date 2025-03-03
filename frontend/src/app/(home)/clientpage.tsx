'use client';

import { Button } from '@/components/ui/button' 
import { useRouter } from 'next/navigation';

export default () => {
    const router = useRouter();

    const gotoGallery = () => {
        router.push('/galleries')
    }
    const gotoLogin = ()=> {
        router.push('/auth/signin')
    }

    return (
        <div className='flex gap-2'>
        <Button onClick={gotoGallery} variant='default' size='lg'>
            Explore it
        </Button>
        <Button onClick={gotoLogin} variant='default' size='lg'>
            Log in
        </Button>
        </div>
    )
}