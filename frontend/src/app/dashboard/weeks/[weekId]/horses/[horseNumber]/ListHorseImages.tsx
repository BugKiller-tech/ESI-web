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
import {
    Modal
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    EventHandler as ReactGridEventHandler
} from '@/components/react-grid-gallery/types'
import { useEffect, useState } from 'react';
import { HorseImageInfo } from 'types';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import ChangeImageNumberForSelectedHorsesModal from "./ChangeImageNumberForSelectedHorsesModal";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import * as APIs from '@/apis';



import { ThumbnailImageProps } from '@/components/react-grid-gallery';
import { Checkbox } from '@/components/ui/checkbox';

const ImageComponent = (props: ThumbnailImageProps) => {
    const { key, ...otherImageProps } = props.imageProps
    return (
        <div style={{
            ...props.imageProps.style,
            position: 'relative',
        }}>
            <img {...otherImageProps} />;
            <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '50px',
                background: 'red',
            }}>
                test
                {/* {JSON.stringify(props.imageProps)} */}
                <Button onClick={() => {
                    console.log('test and test')
                }}>test</Button>
            </div>
        </div>
    );
};

type compProps = {
    horseImages: HorseImageInfo[];
}

export default function ListHorseImages({
    horseImages
}: compProps) {


    const { data: session } = useSession();
    const router = useRouter();

    const fullScreenLoader = useFullScreenLoader();
    const [selectedHorse, setSelectedHorse] = useState<HorseImageInfo | null>(null);
    const [checkedHorseImageIds, setCheckedHorseImageIds] = useState<string[]>([]);
    const [showChangeHorseNumberModal, setShowChangeHorseNumberMmodal] = useState<boolean>(false);

    const [horseImageUrlToDisplayBig, setHorseImageUrlToDisplayBig] = useState<string>('');


    useEffect(() => {
        if (checkedHorseImageIds.length == 0) {
            setShowChangeHorseNumberMmodal(false);
        }
    }, [checkedHorseImageIds])


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

    const toggleSelectionForImage = (horseId: string) => {
        if (!horseId) {
            return;
        }
        if (checkedHorseImageIds.includes(horseId)) {
            setCheckedHorseImageIds(checkedHorseImageIds.filter(id => {
                return id != horseId
            }))
        } else {
            setCheckedHorseImageIds([
                ...checkedHorseImageIds,
                horseId
            ])
        }
    }


    return (
        <div>
            {/* <Gallery images={dispImages}
                thumbnailImageComponent={ImageComponent}
                rowHeight={220}
                enableImageSelection={false}
                // onClick={onImageSelected}
                margin={5}
            /> */}

            <Lightbox
                open={!!horseImageUrlToDisplayBig}
                close={() => setHorseImageUrlToDisplayBig('')}
                index={0}
                slides={[
                    {
                        src: horseImageUrlToDisplayBig
                    }
                ]}
                plugins={[
                    Fullscreen,
                    Zoom
                ]}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
            />

            <Modal
                title='Delete action for image'
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

            {checkedHorseImageIds.length > 0 && (
                <div className='absolute bottom-7 right-3 bg-yellow-300 px-5 py-2
                                flex flex-wrap justify-between items-center gap-3 rounded-md
                                border border-black shadow-lg'>
                    <span className='font-bold'>
                        {checkedHorseImageIds.length} image{checkedHorseImageIds.length > 1 ? 's' : ''} selected!
                    </span>
                    <Button size='lg'
                        className='bg-main-color text-white'
                        onClick={() => {
                            setShowChangeHorseNumberMmodal(true);
                        }}>Change horse number</Button>
                    <Button size='lg'
                        onClick={() => {
                            setCheckedHorseImageIds([]);
                        }}>Clear selection</Button>
                </div>
            )}

            <div className='grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4'>
                {horseImages.map((horse, index) => {
                    return (
                        <div key={horse.horseNumber + index}
                            className='cursor-pointer
                            rounded-lg overflow-hidden
                            flex flex-col
                            bg-center bg-no-repeat bg-cover'

                        // style={{ backgroundImage: `url(/horse_folder.png)` }}
                        >
                            <div
                                style={{
                                    aspectRatio: '3/2',
                                    backgroundImage: `url(${horse.thumbnailS3Link})`,
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                }}></div>
                            <div className='bg-main-horse'>
                                <div className='px-3 py-1 font-bold text-center border-b border-gray-400'>
                                    {horse.originImageName}
                                </div>
                                <div className='px-3 flex-1 flex items-center justify-between py-1 gap-2'>
                                    <Checkbox onClick={() => toggleSelectionForImage(horse._id)}
                                        checked={checkedHorseImageIds.includes(horse._id)} />
                                    <span className='flex-1'></span>
                                    <Button
                                        className='text-white'
                                        onClick={() => {
                                            setHorseImageUrlToDisplayBig(horse.thumbWebS3Link);
                                        }}>
                                        View
                                    </Button>
                                    <Button
                                        variant='destructive'
                                        className='bg-main-color text-white'
                                        onClick={() => {
                                            setSelectedHorse(horse);
                                        }}>Delete</Button>
                                    {/* <div className='font-bold'>
                                    {horse.horseNumber}
                                </div> */}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {
                showChangeHorseNumberModal && <ChangeImageNumberForSelectedHorsesModal
                    selectedHorseImageIds={checkedHorseImageIds}
                    hideModalAction={(isDeleted: boolean) => {
                        setShowChangeHorseNumberMmodal(false);
                        if (isDeleted) {
                            setCheckedHorseImageIds([]);
                        }
                    }}
                />
            }
        </div>
    );
}
