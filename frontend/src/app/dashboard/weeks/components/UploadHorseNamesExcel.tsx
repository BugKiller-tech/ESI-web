'use client';

import * as APIs from "@/apis";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { WeekInfo } from "types";
import { toast } from 'sonner';
import { useSession } from "next-auth/react";
import XLSXUploadComp from "@/components/esi/XLSXUploadComp";






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
