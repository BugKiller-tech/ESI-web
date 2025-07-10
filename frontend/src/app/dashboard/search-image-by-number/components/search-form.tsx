'use client';

import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { HorseImageInfo, WeekInfo } from "types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as APIs from '@/apis';
import { useSession } from "next-auth/react";
import { toast } from "sonner";


interface ComponentProps {
    weeks: WeekInfo[],
}

export default ({
    weeks,
}: ComponentProps) => {

    const { data: session } = useSession();
    const fullScreenLoader = useFullScreenLoader();

    const [selectedWeekId, setSelectedWeekId] = useState('');
    const [
        imageNumbersText, setImageNumbersText,
    ] = useState('');
    const imageNumbers = imageNumbersText.split(/[\n,]+/).reduce((acc, currentVal, index) => {
        if (currentVal.trim() != '') {
            acc.push(currentVal.trim())
        }
        return acc;
    }, [])


    const [searchedImages, setSearchedImages] = useState<HorseImageInfo[]>([]);


    const allInfoInputed = imageNumbers.length > 0 && selectedWeekId;


    const searchImagesByImageNumbers = async () => {
        try {
            fullScreenLoader.showLoader();
            const postData = {
                weekId: selectedWeekId,
                imageNumbers: imageNumbers,
            }
            const response = await APIs.searchImagesByImageNumber(postData, session?.user?.accessToken);
            if (response.data?.horseImages) {
                setSearchedImages(response.data?.horseImages);
                if (response.data?.horseImages.length == 0) {
                    toast.info('No image detected with the image # you provided.')
                }
            }
        } catch (error) {
            console.log(error);
            setSearchedImages([]);
        } finally {
            fullScreenLoader.hideLoader();
        }
    }


    const downloadSearchedImages = async () => {
        try {
            toast.info('Preparing the download..');
            fullScreenLoader.showLoader();

            const postData = {
                weekId: selectedWeekId,
                imageIds: searchedImages.map(h => h._id),
            }
            const response = await APIs.downloadForSelectedImages(postData, session?.user?.accessToken);
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Searched_${ searchedImages.length }_Images.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.info('Download is completed.');

        } catch (error) {
            console.log(error);
            toast.error('Failed to download');
        } finally {
            fullScreenLoader.hideLoader();
        }
    }




    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Search images by image number</CardTitle>
                    <CardDescription>
                        Please fill out the image numbers line by line (multiple)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6 flex flex-col gap-2'>
                <Label className="font-bold text-lg">Select the week</Label>
                <Select
                    onValueChange={(value) => { setSelectedWeekId(value) }}
                    defaultValue={selectedWeekId || ''}
                    value={selectedWeekId}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Select the week' />
                    </SelectTrigger>
                    <SelectContent>
                        {weeks.map((w) => (
                            <SelectItem value={w._id} key={w._id}>
                                <span>{w.year}</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span>{w.weekNumber}</span>
                            </SelectItem>
                        ))
                        }
                    </SelectContent>
                </Select>
                <Label className="font-bold text-lg">Image numbers</Label>
                <Textarea
                    value={imageNumbersText}
                    onChange={(e) => {
                        setImageNumbersText(e.target.value);
                    }}
                    cols={8} />
                <div className="mt-3">
                    <Button className="bg-main-color" disabled={!allInfoInputed}
                        onClick={searchImagesByImageNumbers}>
                        Search images
                    </Button>
                </div>
                {
                    searchedImages.length > 0 && (
                        <div className="mt-7 flex flex-col gap-3 bg-gray-300 rounded-sm p-3">
                            <div className="text-main-color text-2xl">
                                -- Search result --
                            </div>
                            <div className='max-h-60 overflow-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow className='text-xs md:text-base'>
                                            <TableHead>Image name</TableHead>
                                            <TableHead>Horse #</TableHead>
                                            <TableHead>Image</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>

                                        {
                                            searchedImages.map(horseImage => (
                                                <TableRow key={horseImage._id}>
                                                    <TableCell>{horseImage.originImageName}</TableCell>
                                                    <TableCell>{horseImage.horseNumber}</TableCell>
                                                    <TableCell>
                                                        <img src={ horseImage.thumbnailS3Link || horseImage.thumbWebS3Link } width={'50px'} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-3">
                            <Button onClick={downloadSearchedImages} disabled={searchedImages.length == 0}>
                                Download images
                            </Button>
                            </div>
                        </div>

                    )
                }
            </CardContent>
        </Card>
    )
}