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

    const images = [
        {
           src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
           width: 320,
           height: 174,
        //    isSelected: true,
           caption: "After Rain (Jeshu John - designerspics.com)",
        },
        {
           src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
           width: 320,
           height: 212,
           tags: [
              { value: "123", title: "timestamp" },
           ],
        },
        {
           src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
           width: 320,
           height: 212,
        },
     ];

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
