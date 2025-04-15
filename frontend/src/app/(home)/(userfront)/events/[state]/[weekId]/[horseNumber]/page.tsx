'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';

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
import * as APIs from '@/apis';

export default () => {

    const params = useParams();
    const { state, weekId, horseNumber } = params;



    const [ horseImages, setHorseImages ] = useState<HorseInfo[]>([]);
    const [ openImageModal, setOpenImageModal ] = useState(false);
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

    const fetchHorseImages = async () => {
        try {
            const response = await APIs.getHorseImagesByWeekAndHorseNumber({
                weekId,
                horseNumber,
            })
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


    const addToCart = (e: any, index: number) => {

        toast.success('test is cool');
        console.log(horseImages[index]);
        e.stopPropagation();
    }


    return (
        <div>
            <RowsPhotoAlbum photos={photos} render={{
                    // photo: ({ onClick }, { photo, width, height }) => (
                    //     <div key={photo.src}>
                    //         <img src={photo.src} width="100%" />
                    //     </div>
                    //   ),
                    extras: (_, { photo, index }) => (
                        // <FavoriteIcon photo={photo} index={index} />
                        <div className='bg-main-horse flex items-center justify-center px-3 py-2' key={index}>
                            <div onClick={(e) => addToCart(e, index)}
                                className='text-main-btn rounded-md border-2 border-main-btn
                                            px-3 py-1 flex gap-2
                                            cursor-pointer'>
                                <ShoppingCart />
                                Add to cart
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
                
            />
            <Lightbox
                open={openImageModal}
                close={() => setOpenImageModal(false)}
                index={currentImageIndex}
                slides={images}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            />
        </div>
    )
}