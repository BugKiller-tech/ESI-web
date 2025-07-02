import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { SearchParams } from 'nuqs/server';
import { Suspense, useEffect } from 'react';
import SearchForm from './components/search-form';
import * as APIs from '@/apis';
import { auth } from '@/lib/auth';
import { WeekInfo } from 'types';

export const metadata = {
    title: 'Search by image number',
}

export default async () => {

    const session = await auth();
    let weeks: WeekInfo[] = [];

    try {
        const response = await APIs.getAllWeeks();
        if (response.data.weeks) {
            console.log(response.data.weeks);
            weeks =  response.data.weeks;
        }
    } catch (error) {
        console.log(error);
    }
    
    return (
        <PageContainer scrollable={false}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                    <Heading
                        title='Search images'
                        description='Search images with image number'
                    />
                </div>
                <Separator />
                <SearchForm weeks={weeks} />
                
            </div>
        </PageContainer>
    )
}