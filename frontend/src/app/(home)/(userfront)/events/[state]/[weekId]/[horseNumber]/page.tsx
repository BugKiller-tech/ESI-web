'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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



    return (
        <div>
            <RowsPhotoAlbum photos={photos} render={{
                    link: (props) => <a {...props} />,
                    // extras: (_, { photo, index }) => (
                    //     <FavoriteIcon photo={photo} index={index} />
                    //     <div className='bg-orange-500'>
                    //         <button onClick={() => {
                    //             console.log('testing for cart btn')
                    //         }}>Add to cart</button>
                    //     </div>
                    // ),
                    // button: (props) => (
                    //     <button {...props}>
                    //         testing
                    //     </button>
                    // ),
                    // container: ({ ref, ...rest }) => <div ref={ref} {...rest}></div>,
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
            />
        </div>
    )
}