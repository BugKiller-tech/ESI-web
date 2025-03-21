'use client'

import { useState, useEffect, useTransition } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as APIs from '@/apis';


interface JsonUploadProps {
    onJsonFileSelected: (jsonFile: File | null) => void,
}

const JsonUploadComp = ({ onJsonFileSelected }: JsonUploadProps) => {  
    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // Since we only allow 1 file
      if (file) {
        onJsonFileSelected(file); // Pass the selected image to the parent component
      }
    };
  
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/json': ['.json']
        },
        onDrop, // Handle the dropped files
        maxFiles: 1, // Limit to 1 file only
        multiple: false, // Ensure only 1 file can be selected at a time
    });
  
    return (
      <div>
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop timestamp json file, or click to select one</p>
        </div>
      </div>
    );
};


interface ImageUploadProps {
    onImagesSelect: (imageFiles: File[]) => void,
}

const ImagesUploadWithPreview = ({ onImagesSelect }: ImageUploadProps) => {  
    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImagesSelect(acceptedFiles); // Pass the selected image to the parent component
      }
    };
  
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        onDrop, // Handle the dropped files
        maxFiles: 500, // Limit to 1 file only
        multiple: true, // Ensure only 1 file can be selected at a time
    });
  
    return (
      <div>
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #ccc',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop an images, or click to select one</p>
        </div>
      </div>
    );
};




export default () => {
    const [ loadingForSave, startTransitionForSave ] = useTransition();

    const [ selectedState, setSelectedState ] = useState<string>('FL');
    const [selectedJsonFile, setSelectedJsonFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);


    const allInfoIsSelected = selectedState && selectedJsonFile && imageFiles.length > 0

    const imagesSelected = (imageFiles: File[]) => {
        setImageFiles(imageFiles)
    }

    const removeOneSelectedImage = (idx: number) => () => {
        const newImages = [...imageFiles];
        newImages.splice(idx, 1);
        setImageFiles(newImages);
    }
   

    useEffect(() => {
        const fetchData = async () => {
            
        }
        fetchData();
    }, [])


    const uploadImagesForSort = async () => {
        try {
            const formData = new FormData();
            formData.append('state', selectedState);
            if (selectedJsonFile) {
                formData.append('timestampJson', selectedJsonFile);
            }
            for (const file of imageFiles) {
                formData.append('horseImages', file);
            }
            const response = await APIs.uploadHorseImages(formData)
            console.log(response.data);
            
        } catch (error) {
            console.log(error);
            toast.error('Failed to upload watermark image');
        }
    }
    const cancelImagesSelection = () => {
        setImageFiles([]);
    }

    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                    <CardTitle>Upload images</CardTitle>
                    <CardDescription>
                        Here you can upload your horse images to sort
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='px-2 sm:p-6'>

                <h3 className='text-xl font-bold mb-5'>State</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value) => { setSelectedState(value) }}
                        defaultValue={selectedState}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='FL'>FL</SelectItem>
                            <SelectItem value='NY'>NY</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <h3 className='text-xl font-bold mb-5'>Timestamp Json file</h3>
                <JsonUploadComp onJsonFileSelected={(file) => {
                    setSelectedJsonFile(file)
                }} />
                { selectedJsonFile  && <div>{ selectedJsonFile.name } is selected</div> }


                <h3 className='text-xl font-bold mt-5 mb-5'>Horse Images for above json</h3>
                <ImagesUploadWithPreview onImagesSelect={imagesSelected} />

                {/* show selected watermark */}
                {imageFiles && imageFiles.length > 0 && (
                    <div>
                        <h3>Preview:</h3>
                        <div className='flex gap-2 flex-wrap max-h-[450px] overflow-y-auto'>
                         { imageFiles.map((file, index) => {
                            return (
                            <div className='relative' key={index}>
                                <img src={URL.createObjectURL(file)} alt="Preview"
                                    width="150" />
                                <span className='absolute top-1 right-1 cursor-pointer'
                                    onClick={removeOneSelectedImage(index)}>X</span>
                            </div>
                            )
                         })}
                        </div>
                    </div>
                    )}

                { imageFiles && imageFiles.length > 0 && (<div className='mt-3 flex gap-2'>
                    <Button disabled={!allInfoIsSelected}
                        onClick={uploadImagesForSort}>Upload</Button>
                    <Button onClick={cancelImagesSelection}>Cancel</Button>
                </div>) }
                
            </CardContent>
        </Card>
    )
}