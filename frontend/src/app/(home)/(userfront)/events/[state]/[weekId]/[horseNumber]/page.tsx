'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
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
    ShoppingCart
} from 'lucide-react';


import { HorseInfo } from 'types';
import { AddCartModal } from './AddCartModal';
import * as APIs from '@/apis';

import './style.scss';

export default () => {

    const params = useParams();
    const { state, weekId, horseNumber } = params;
    const { data: session } = useSession();
    
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [selectedHorse, setSelectedHorse] = useState<HorseInfo | null>(null);


    const [horseImages, setHorseImages] = useState<HorseInfo[]>([]);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const photos = horseImages.map(h => {
        return {
            width: h.aspectRatio * height,
            height: height,
            src: h.thumbnailS3Link,
        }
    });
    const images = horseImages.map(h => {
        return {
            src: h.thumbWebS3Link
        }
    })


    const displayAddToCartPopup = (e: any, index: number) => {

        setSelectedHorse(horseImages[index]);
        setIsOpenCartModal(true);
        e.stopPropagation();
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
            <div className="grid-container">
                {photos.map((photo, index) => (
                    <div className="cell" key={index}>
                        <div className="image-wrapper cursor-pointer" onClick={() => {
                            setCurrentImageIndex(index);
                            setOpenImageModal(true);
                        }}>
                            <img src={photo.src} alt="Image" />
                        </div>
                        <div className='bg-main-horse flex items-center justify-center px-3 py-2' key={index}>
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
                slides={images}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
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