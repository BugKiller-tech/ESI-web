'use client';

import { useDropzone } from "react-dropzone";
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

export default XLSXUploadComp;

