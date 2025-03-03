'use client'
import { useState, useEffect } from 'react'
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default () => {
    const [ images, setImages ] = useState([]);
    const [ openImageModal, setOpenImageModal ] = useState(false);
    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);

    const fetchImages = async () => {
        try {
            let response = await fetch('https://picsum.photos/v2/list?page=1&limit=25')
            let data = await response.json()
            console.log('data for images are', data)
            setImages(data.map((item: any) => {
                return {
                    width: item?.width,
                    height: item?.height,
                    src: item?.download_url
                }
            }));
        } catch (e) {
            console.log('error on', e);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            await fetchImages();
        }
        fetchData();
    }, []);


    return (
        <div>
            <RowsPhotoAlbum photos={images} render={{
                    link: (props) => <a {...props} />,
                    extras: (_, { photo, index }) => (
                        // <FavoriteIcon photo={photo} index={index} />
                        <div className='bg-orange-500'>
                            {/* <button onClick={() => {
                                console.log('testing for cart btn')
                            }}>Add to cart</button> */}
                        </div>
                    ),
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