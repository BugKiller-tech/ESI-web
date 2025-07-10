'use client';

import * as APIs from "@/apis";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { WeekInfo } from "types";
import { toast } from 'sonner';
import { useSession } from "next-auth/react";




interface XLSXUploadProps {
    onXlsxFileSelected: (jsonFile: File | null) => void,
}

const XLSXUploadComp = ({ onXlsxFileSelected }: XLSXUploadProps) => {
    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]; // Since we only allow 1 file
        if (file) {
            onXlsxFileSelected(file); // Pass the selected image to the parent component
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            // 'application/vnd.ms-excel': ['.xls'],
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
                <p>Drag & drop XLSX file, or click to select one</p>
            </div>
        </div>
    );
};


type CompProps = {
    week: WeekInfo,
    isOpened: boolean,
    closeModalAction: Function,
}

export default ({
    week,
    isOpened,
    closeModalAction,
}: CompProps) => {

    const { data: session } = useSession();

    const [selectedXlsxFile, setSelectedXlsxFile] = useState<File | null>(null);

    const uploadHorseNamesExcelAction = async () => {
        try {
            const formData = new FormData();
            formData.append('horseNamesExcel', selectedXlsxFile);
            formData.append('weekId', week._id);
            const response = await APIs.uploadHorseNamesExcel(formData, session?.user?.accessToken);
            if (response.data) {
                toast.success('Successfully uploaded excel. it will be processed.');
                closeModalAction();
            }
        } catch (error: any) {
            console.log(error);
            let errorMsg = `Failed to upload`;
            if (error?.data?.message) {
                errorMsg += ` - ${ error?.data?.message }`;
            }
            toast.error(errorMsg);
        }
    }

    return (
        <Modal
            title='Upload horse names XLSX'
            description='Please select the horse names excel and proceed'
            isOpen={isOpened}
            onClose={() => {
                closeModalAction();
            }}>
            {/*  */}
            <div className='flex flex-col gap-3'>
                {week && <div className="text-main-color font-bold text-lg">
                    Week Info: {week.state} - {week.year} - {week.weekNumber}
                </div>}
                <div>
                    <XLSXUploadComp onXlsxFileSelected={(file) => {
                        setSelectedXlsxFile(file)
                    }} />

                    {selectedXlsxFile && <div className="mt-2 bg-gray-200 rounded-md p-2">
                        <span className="font-bold">{selectedXlsxFile.name}</span> is selected
                    </div>
                    }
                </div>
                <div>
                    <Button className="bg-main-color font-bold" disabled={!selectedXlsxFile}
                    onClick={uploadHorseNamesExcelAction}>
                        Upload
                    </Button>
                </div>
            </div>
        </Modal>
    )
};
