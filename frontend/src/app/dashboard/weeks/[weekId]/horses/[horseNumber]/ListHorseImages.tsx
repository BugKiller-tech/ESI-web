'use client';
// import { ImageGallery  } from 'react-image-grid-gallery';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Gallery } from '@/components/react-grid-gallery';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    EventHandler as ReactGridEventHandler
} from '@/components/react-grid-gallery/types'
import { useState } from 'react';
import { HorseInfo } from 'types';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import * as APIs from '@/apis';



type compProps = {
    horseImages: HorseInfo[];
}

export default function ListHorseImages({
    horseImages
}: compProps) {


    const { data: session } = useSession();
    const router = useRouter();

    const fullScreenLoader = useFullScreenLoader();
    const [ selectedHorse, setSelectedHorse ] = useState< HorseInfo | null >(null);


    const dispHorseImages = [];

    if (horseImages.length > 0) {

    }

    const dispImages = horseImages.map(h => {
        return {
            src: h.thumbnailS3Link,
            width: h.aspectRatio * 250,
            height: 250,
        }
    })



    //  const imagesInfoArray = horseImages.map(h => {
    //     return {
    //         id: h._id,
    //         alt: 'test',
    //         caption: h.thumbnailS3Link,
    //         src: h.thumbnailS3Link,
    //     }
    //  })

    const onImageSelected: ReactGridEventHandler = (index, item, event) => {
        const horse = horseImages[index];
        setSelectedHorse(horse);
        console.log(index, item, event);
        console.log('selected horse image is just', horse);
    }

    const onImageSelectedInGrid = () => {

    }

    const deleteImageAction = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.deleteHorseImageByAdmin(selectedHorse.week, selectedHorse._id, session?.user?.accessToken);
            setSelectedHorse(null);
            router.refresh();
        } catch (error) {
            console.log(error);
        }
        fullScreenLoader.hideLoader();
    }


    return (
        <div>
            <Gallery images={dispImages}
                rowHeight={220}
                enableImageSelection={false}
                onClick={onImageSelected}
                margin={5}
            />

            <Modal
                title='Action for image'
                description='Here is the simple actions for image.'
                isOpen={selectedHorse ? true : false}
                onClose={() => {
                    setSelectedHorse(null);
                }}>
                {/*  */}
                <div className='flex items-center justify-end space-x-2 pt-6'>
                    <Button variant='destructive' onClick={deleteImageAction}
                        className='flex gap-2 bg-main-color'>
                        Yes, Delete
                    </Button>
                </div>
            </Modal>
            {/* <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
            { horseImages.map((horse, index) => {
                    return (
                        <div key={horse.horseNumber + index}
                            className='cursor-pointer
                            rounded-lg overflow-hidden
                            flex flex-col
                            bg-center bg-no-repeat bg-cover'
                            // style={{ backgroundImage: `url(${horse.thumbnailS3Link})` }}
                            style={{ backgroundImage: `url(/horse_folder.png)` }}
                            onClick={() => {
                                onImageSelected(horse.horseNumber);
                            }}>
                            <div className='min-h-[100px] md:min-h-[200px]'></div>
                            <div className='flex-1 flex items-center bg-main-horse px-3 py-2'>
                                <div className='font-bold'>
                                    { horse.horseNumber }
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div> */}
        </div>
    );
}
