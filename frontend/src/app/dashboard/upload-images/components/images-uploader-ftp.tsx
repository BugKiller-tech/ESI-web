'use client'

import { useSession } from 'next-auth/react';
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


type StateType = 'FL' | 'NY'
export default () => {
    const { data: session } = useSession();
    const [ loading, startTransition ] = useTransition();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);
    const availableWeekNumbers = {
        'FL': [
            'Wk1-12',
        ],
        'NY': [
            'Wk1-3',
            'Wk4-6',
            'Wk7-9',
            'Wk10-12'
        ]
    }

    const [ year, setYear ] = useState<Number>(currentYear);
    const [ selectedState, setSelectedState ] = useState<StateType>('FL');
    const [ weekNumber, setWeekNumber ] = useState<string>(availableWeekNumbers['FL'][0]);
    const [selectedJsonFile, setSelectedJsonFile] = useState<File | null>(null);
    const [ availableFtpFolders, setAvailableFtpFolders ] = useState<string[]>([]);
    const [ selectedFtpFolder, setSelectedFtpFolder ] = useState('');


    const allInfoIsSelected = selectedState && selectedJsonFile && selectedFtpFolder

    const clearSelections = () => {
        setSelectedJsonFile(null);
        setSelectedFtpFolder('');
    }

    const fetchFtpFolders = async () => {
        const response = await APIs.getHorsesFtpFolders(session?.user?.accessToken);
        if (response.data) {
            setAvailableFtpFolders(response.data.folders);
            setSelectedFtpFolder('');
        }
    }

    useEffect(() => {
        fetchFtpFolders();
    }, [])


    const uploadFtpFolderAndTimestampForSort = async () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('year', year.toString());
                formData.append('state', selectedState);
                formData.append('weekNumber', weekNumber);
                if (selectedJsonFile) {
                    formData.append('timestampJson', selectedJsonFile);
                }
                formData.append('ftpFolder', selectedFtpFolder);
               
                const response = await APIs.uploadFtpFolderAndTimestamp(formData, session?.user?.accessToken)
                console.log(response.data);
                toast.success('Successfully uploaded. sorting is started behind the scene');
                
            } catch (error) {
                console.log('TTTT', error.response?.data?.message);
                toast.error('Failed to process ftp folder');
            }
        })
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
                <h3 className='text-xl font-bold mb-5'>Year</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value) => { setYear(parseInt(value)) }}
                        defaultValue={`${year}`}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            { yearOptions.map((y) => (
                                <SelectItem value={`${y}`} key={y}>{y}</SelectItem>
                            ))
                            }
                        </SelectContent>
                    </Select>
                </div>


                <h3 className='text-xl font-bold mb-5'>State</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value: StateType) => {
                            setSelectedState(value)
                            console.log('selected state is', value);
                            setWeekNumber(availableWeekNumbers[value][0]);
                        }}
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

                <h3 className='text-xl font-bold mb-5'>Week Number</h3>
                <div className='mb-5'>
                    <Select
                        onValueChange={(value) => { setWeekNumber(value) }}
                        value={weekNumber}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                        <SelectContent>
                            { availableWeekNumbers[selectedState].map(item => (
                                <SelectItem value={item} key={item}>{ item }</SelectItem>
                            )) }
                        </SelectContent>
                    </Select>
                </div>

                <h3 className='text-xl font-bold mb-5'>Timestamp Json file</h3>
                <JsonUploadComp onJsonFileSelected={(file) => {
                    setSelectedJsonFile(file)
                }} />
                { selectedJsonFile  && <div>{ selectedJsonFile.name } is selected</div> }


                <h3 className='text-xl font-bold mt-5 mb-5'>
                    Select the horse images folder
                    <span>
                        
                    </span>
                </h3>
                <Select
                    onValueChange={(value) => { setSelectedFtpFolder(value) }}
                    defaultValue={selectedState}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Select ftp folder' />
                    </SelectTrigger>
                    <SelectContent>
                        { availableFtpFolders.map((folderName) => (
                            <SelectItem key={folderName} value={folderName}>{folderName}</SelectItem>
                        )) }
                    </SelectContent>
                </Select>

                { allInfoIsSelected && (<div className='mt-3 flex gap-2'>
                    <Button disabled={!allInfoIsSelected || loading}
                        onClick={uploadFtpFolderAndTimestampForSort}>Upload</Button>
                    <Button onClick={clearSelections}>Cancel</Button>
                </div>) }
                
            </CardContent>
        </Card>
    )
}