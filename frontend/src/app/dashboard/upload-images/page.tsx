import PageContainer from "@/components/layout/page-container";
import ImagesUploader from './components/images-uploader';

export const metadata = {
    title: 'Dashboard : Upload images',
  };

export default async function Page() {
  return (
    <PageContainer>
        <div className="flex-grow">
            <h2 className='text-2xl font-bold tracking-tight mb-5'>
                Upload images
            </h2>
            <div className="">
                <ImagesUploader />
            </div>
        </div>
    </PageContainer>
  )
}