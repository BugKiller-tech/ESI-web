'use client'

import { useSession } from 'next-auth/react';
import { useState, useEffect, useTransition, useRef } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

import * as APIs from '@/apis';
import { Modal } from '@/components/ui/modal';
import XLSXUploadComp from "@/components/esi/XLSXUploadComp";
import {
    StateType,
    availableWeekNumbers,
} from '@/constants/esi-constants'
import { useRouter } from 'next/navigation';



export default () => {
    const { data: session } = useSession();
    const [loading, startTransition] = useTransition();
    const router = useRouter();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);
    

    const [year, setYear] = useState<Number>(currentYear);
    const [selectedState, setSelectedState] = useState<StateType>('FL');
    const [weekNumber, setWeekNumber] = useState<string>(availableWeekNumbers['FL'][0]);
    const [selectedXlsxFile, setSelectedXlsxFile] = useState<File | null>(null);

    const allInfoIsSelected = year && selectedState && weekNumber && selectedXlsxFile

    const uploadHorseNamesExcel = async () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('year', year.toString());
                formData.append('state', selectedState);
                formData.append('weekNumber', weekNumber);
                if (selectedXlsxFile) {
                    formData.append('horseNamesExcel', selectedXlsxFile);
                }

                const response = await APIs.uploadHorseNamesExcelForUpcomingWeek(formData, session?.user?.accessToken)
                console.log(response.data);
                if (response.data) {
                    toast.success('Successfully uploaded. horse names are store for your upcoming image uploads');
                    router.replace('/dashboard/weeks');
                    router.refresh();
                }

            } catch (error: any) {
                let errorMsg = error?.response?.data?.message || '';
                toast.error(`Error:.\n ${errorMsg}`);
            }
        })
    }

    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Upload horse names EXCEL</CardTitle>
                    <CardDescription>
                        Here you can upload horse names EXCEL for upcoming horse show week
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6'>
                <h3 className='text-xl font-bold mb-5'>Year</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value) => { setYear(parseInt(value)) }}
                        defaultValue={`${year}`}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map((y) => (
                                <SelectItem value={`${y}`} key={y}>{y}</SelectItem>
                            ))
                            }
                        </SelectContent>
                    </Select>
                </div>


                <h3 className='text-xl font-bold mb-5'>State</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value: StateType) => {
                            setSelectedState(value)
                            console.log('selected state is', value);
                            setWeekNumber(availableWeekNumbers[value][0]);
                        }}
                        defaultValue={selectedState}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='FL'>FL</SelectItem>
                            <SelectItem value='NY'>NY</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <h3 className='text-xl font-bold mb-5'>Week Number</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value) => { setWeekNumber(value) }}
                        value={weekNumber}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            {availableWeekNumbers[selectedState].map(item => (
                                <SelectItem value={item} key={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <h3 className='text-xl font-bold mb-5'>Horsenames Excel</h3>
                <XLSXUploadComp onXlsxFileSelected={(file) => {
                        setSelectedXlsxFile(file)
                    }} />
                    {selectedXlsxFile && <div className="mt-2 bg-gray-200 rounded-md p-2">
                        <span className="font-bold">{selectedXlsxFile.name}</span> is selected
                    </div>
                    }

                {allInfoIsSelected && (<div className='mt-3 flex gap-2'>
                    <Button disabled={!allInfoIsSelected || loading}
                        onClick={uploadHorseNamesExcel}>Upload excel</Button>
                </div>)}

            </CardContent>
        </Card>
    )
}