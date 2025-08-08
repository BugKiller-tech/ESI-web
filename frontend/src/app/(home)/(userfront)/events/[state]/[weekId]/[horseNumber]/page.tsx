'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "sonner";
import {
    ShoppingCart,
    ArrowBigLeft
} from 'lucide-react';


import { HorseImageInfo } from 'types';
import { AddCartModal } from './AddCartModal';
import * as APIs from '@/apis';

import './style.scss';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export default () => {

    const params = useParams();
    const { state, weekId } = params;
    const horseNumber = decodeURIComponent(params.horseNumber as string || '');

    const { data: session } = useSession();

    const router = useRouter();

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [selectedHorse, setSelectedHorse] = useState<HorseImageInfo | null>(null);


    const [horseImages, setHorseImages] = useState<HorseImageInfo[]>([]);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);

    const fetchHorseImages = async () => {
        try {
            const response = await APIs.getHorseImagesByWeekAndHorseNumber({
                weekId,
                horseNumber,
            }, session?.user?.accessToken)
            setHorseImages(response.data.horseImages);
        } catch (e) {
            console.log('error on', e);
        }
    }
    // useEffect(() => {
    //     fetchHorseImages();
    // }, []);
    useEffect(() => {
        fetchHorseImages();
    }, [weekId, horseNumber])


    const height = 200;
    let photos = horseImages.map(h => {
        return {
            width: h.aspectRatio * height,
            height: height,
            src: h.thumbnailS3Link,
            originImageName: h.originImageName,

            thumbWebS3Link: h.thumbWebS3Link,
        }
    });
    // photos = [...photos, ...photos, ...photos, ...photos, ...photos, ...photos]  // temp code for testing. must be removed before push

    const thumbWebImages = photos.map(h => {
        return {
            src: h.thumbWebS3Link
        }
    })


    const displayAddToCartPopup = (e: any, index: number) => {

        setSelectedHorse(horseImages[index]);
        setIsOpenCartModal(true);
        if (e) {
            e.stopPropagation();
        }
    }


    return (
        <div className="md:container mx-auto">
            {/* <RowsPhotoAlbum photos={photos} render={{
                    // photo: ({ onClick }, { photo, width, height }) => (
                    //     <div key={photo.src}>
                    //         <img src={photo.src} width="100%" />
                    //     </div>
                    //   ),
                    extras: (_, { photo, index }) => (
                        // <FavoriteIcon photo={photo} index={index} />
                        <div className='bg-main-horse flex items-center justify-center px-3 py-2' key={index}>
                            <div onClick={(e) => displayAddToCartPopup(e, index)}
                                className='text-main-color rounded-md border-2 border-main-color
                                            px-3 py-1 flex gap-2
                                            cursor-pointer'>
                                <ShoppingCart />
                                <div>Add to cart</div>
                            </div>
                        </div>
                    ),
                }}
                onClick={({ event, photo, index }) => {
                    console.log('testing', event, photo, index);
                    
                    event.preventDefault();
                    setCurrentImageIndex(index);
                    setOpenImageModal(true);
                }}
                
            /> */}
            <div className='text-center'>
                <Button className='bg-main-color text-white mb-3 font-bold'
                    onClick={() => {
                        router.push('/search-photos');
                    }}>
                    <ArrowBigLeft />
                    Back to Search
                </Button>
            </div>
            {/* <div className='text-center'>
                                
            </div> */}
            <div className="grid-container">
                {photos.map((photo, index) => (
                    <div className={clsx('cell',
                        currentImageIndex != index && 'border border-gray-300',
                        currentImageIndex == index && 'border-2 border-main-color scale-105',
                    )} key={index}>
                        <div className="image-wrapper cursor-pointer" onClick={() => {
                            setCurrentImageIndex(index);
                            setOpenImageModal(true);
                        }}>
                            <img src={photo.src} alt="Image" />
                        </div>
                        <div className='px-3 py-1 font-bold text-center'>{photo.originImageName}</div>
                        <div className='bg-gray-300 flex items-center justify-center px-3 py-2' key={index}>
                            <div onClick={(e) => displayAddToCartPopup(e, index)}
                                className='text-main-color rounded-md border-2 border-main-color
                                            px-3 py-1 flex gap-2
                                            cursor-pointer'>
                                <ShoppingCart />
                                <div>Add to cart</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Lightbox
                open={openImageModal}
                close={() => setOpenImageModal(false)}
                index={currentImageIndex}
                slides={thumbWebImages}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                zoom={{
                    maxZoomPixelRatio: 2,
                }}
                on={{
                    view: ({ index }) => {
                        setCurrentImageIndex(index);
                    }
                }}
                toolbar={{
                    buttons: [
                        <Button key='add_to_cart'
                            className='bg-main-color font-bold text-white'
                            onClick={() => {
                                displayAddToCartPopup(null, currentImageIndex);
                            }}>Add to cart</Button>,
                        <Button key='back_to_photos'
                            onClick={() => {
                                setOpenImageModal(false);
                            }}>Back to photos</Button>,
                    ]
                }}
            />


            <AddCartModal
                isOpen={isOpenCartModal}
                onClose={() => {
                    setIsOpenCartModal(false);
                }}
                onConfirm={() => {

                }}
                horse={selectedHorse}
            />
        </div>
    )
}