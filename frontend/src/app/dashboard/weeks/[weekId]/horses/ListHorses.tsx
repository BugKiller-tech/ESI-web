'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type compProps = {
    weekId: string;
    horses: string[];
}

export default function ({
    weekId,
    horses,
}: compProps) {

    const router = useRouter();

    
    const viewImagesForHorse = (horseNumber: string) => {
        router.push(`/dashboard/weeks/${weekId}/horses/${horseNumber}`);
    }

    return (
        <div className="flex gap-2 md:gap-4 flex-wrap">
            { horses.map((horseNumber) => (
                <Card key={horseNumber} className='lg:min-w-[250px]'>
                    <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                            <CardTitle>{ horseNumber }</CardTitle>
                            <CardDescription>
                                
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className='px-2 sm:p-6 flex justify-center'>
                        <Button size='sm' onClick={() => viewImagesForHorse(horseNumber)}>View images</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}