import PageContainer from "@/components/layout/page-container";
import ImagesUploaderFtp from './components/images-uploader-ftp';

export const metadata = {
    title: 'Dashboard : Upload images',
  };

export default async function Page() {
  return (
    <PageContainer>
        <div className="flex-grow max-w-[800px]">
            <h2 className='text-2xl font-bold tracking-tight mb-5'>
                Upload images
            </h2>
            <div className="">
                <ImagesUploaderFtp />
            </div>
        </div>
    </PageContainer>
  )
}