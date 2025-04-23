'use client'

import { useState, useEffect, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as APIs from '@/apis';


interface ImageUploadProps {
    onImageSelect: (imageFile: File | null) => void,
}

const ImageUploadWithPreview = ({ onImageSelect }: ImageUploadProps) => {  
    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // Since we only allow 1 file
      if (file) {
        onImageSelect(file); // Pass the selected image to the parent component
      }
    };
  
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png']
        },
        onDrop, // Handle the dropped files
        maxFiles: 1, // Limit to 1 file only
        multiple: false, // Ensure only 1 file can be selected at a time
    });
  
    return (
      <div>
        <div className='mb-5'
          {...getRootProps()}
          style={{
            border: '2px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop an image, or click to select one</p>
        </div>
      </div>
    );
};




export default () => {
    const { data: session } = useSession();
    const [ loadingForSave, startTransitionForSave ] = useTransition();

    const [ currentWatermarkUrl, setCurrentWatermarkUrl ] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const imageSelected = (imageFile: File | null) => {
        setImageFile(imageFile)
    }
   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await APIs.getWatermarkImage(session?.user?.accessToken)
                if (response.data.watermarkImage) {
                    setCurrentWatermarkUrl(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${response.data.watermarkImage}`);
                }
            } catch (error) {
                toast.error('Failed to fetch image setting')
            }
        }
        fetchData();
    }, [])


    const uploadWatermarkImage = async () => {
        try {
            if (imageFile) {
                const formData = new FormData()
                formData.append('watermarkImage', imageFile);
                const response = await APIs.uploadWatermarkImage(formData, session?.user?.accessToken)
                console.log(response);
                toast.success('Successfully uploaded')
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to upload watermark image');
        }
    }
    const cancelImageSelection = () => {
        setImageFile(null);
    }

    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Watermark image</CardTitle>
                    <CardDescription>
                        Here you can upload your watermark image
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6'>
                <ImageUploadWithPreview onImageSelect={imageSelected} />
                {/* show current watermark */}
                { !imageFile && currentWatermarkUrl && <img src={currentWatermarkUrl} alt="Current watermark" width="200" className='mx-auto' /> }
                {/* show selected watermark */}
                {imageFile && (
                    <div>
                        <h3>Preview:</h3>
                        <div>
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" width="200" className='mx-auto' />
                        </div>
                    </div>
                    )}

                { imageFile && (<div className='mt-3 flex gap-2'>
                    <Button onClick={uploadWatermarkImage}>Upload</Button>
                    <Button onClick={cancelImageSelection}>Cancel</Button>
                </div>) }
                
            </CardContent>
        </Card>
    )
}