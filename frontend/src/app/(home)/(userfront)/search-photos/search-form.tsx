'use client';

import { Button } from '@/components/ui/button';
import { WeekInfo, HorseImageInfo } from 'types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchByHorseNumber from './components/SearchByHorseNumber';
import SearchByHorseName from './components/SearchByHorseName';
import { useEffect, useState } from 'react';


export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {

    const [activeTab, setActiveTab] = useState("searchByHorseNumber");

    useEffect(() => {

        // On page load: check if it was a refresh
        const lastActiveTab = localStorage.getItem('lastActiveTab');
        if (lastActiveTab) {
            setActiveTab(lastActiveTab);
        }
    }, [])

    const onTabChange = (value: string) => {
        setActiveTab(value);
        localStorage.setItem('lastActiveTab', value);
    }


    const openWordpressSite = () => {
        window.open('https://past.esiphoto1.com/', '_blank');
    }




    return (
        <div className='flex flex-wrap justify-center
                                gap-14 md:gap-7 xl:gap-10'>
            <div className='w-[530px] max-w-[90vw] flex flex-col gap-5'>
                <img src="/Turnout-for-Horses.jpg" className='w-full' />
                <div>
                    <div className='text-3xl md:text-4xl xl:text-5xl text-center text-main-color'>
                        HITS on the Hudson
                    </div>
                </div>
                <Tabs defaultValue='searchByHorseNumber' className='rounded-lg space-y-4'
                    value={activeTab}
                    onValueChange={(newval) => {
                        onTabChange(newval)
                    }}>
                    <TabsList className='flex'>
                        <TabsTrigger className='flex-1'
                            value='searchByHorseNumber'>
                            Search by Horse number
                        </TabsTrigger>
                        <TabsTrigger className='flex-1'
                            value='searchByHorseName'>
                            Search by Horse name
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='searchByHorseNumber'>
                        <SearchByHorseNumber weeks={weeks} />
                    </TabsContent>
                    <TabsContent value='searchByHorseName'>
                        <SearchByHorseName weeks={weeks} />
                    </TabsContent>

                </Tabs>
            </div>
            <div className='w-[530px] max-w-[90vw] flex flex-col gap-5'>
                <img src="/420DI2_3665_PAGE 2.jpg" className='w-full' />
                <div>
                    <div className='text-3xl md:text-4xl xl:text-5xl text-center text-main-color'>
                        <div>Ocala, FL 2025</div>
                        <div className="mt-3">HITS on the Hudson 2024,2025</div>
                    </div>
                </div>
                <div className='flex-1'></div>
                <Button size='lg' className='bg-main-color font-bold text-2xl'
                    onClick={openWordpressSite}>
                    View
                </Button>
            </div>
            
        </div>
    )
}
