'use client';
// import { ImageGallery  } from 'react-image-grid-gallery';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Gallery } from '@/components/react-grid-gallery';
import {
    EventHandler as ReactGridEventHandler
} from '@/components/react-grid-gallery/types'



type compProps = {
    horseImages: any[];
}

export default function ListHorseImages({
    horseImages
}: compProps) {


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
        const horseImage = horseImages[index]
        console.log(index, item, event);
        console.log('selected horse image is just', horseImage);
    }


    return (
        <div>
            <Gallery images={dispImages}
                rowHeight={220}
                enableImageSelection={false}
                onClick={onImageSelected}
                margin={5}
            />
        </div>
    );
}
