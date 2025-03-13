import PageContainer from "@/components/layout/page-container";
import ImageSettings  from "./components/image-settings";
import WaterMarkUpload from "./components/watermark-upload";
import TaxSetting from "./components/tax-setting";

export default async () => {
    return (
        <PageContainer>
            <div className="flex-grow">
                <h2 className='text-2xl font-bold tracking-tight mb-5'>
                    Settings Admin Page
                </h2>
                <div className="flex flex-wrap gap-5">
                    <ImageSettings />
                    <WaterMarkUpload />
                    <TaxSetting />
                </div>
            </div>
        </PageContainer>
    )

}