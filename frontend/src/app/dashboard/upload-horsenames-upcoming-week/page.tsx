import PageContainer from "@/components/layout/page-container";
import HorsenamesExcelUpload from './components/HorsenamesExcelUpload';

export const metadata = {
    title: 'Dashboard : Upload images',
  };

export default async function Page() {
  return (
    <PageContainer>
        <div className="flex-grow max-w-[800px]">
            <h2 className='text-2xl font-bold tracking-tight mb-5'>
                Upload horsenames excel for upcoming week
            </h2>
            <div className="">
                <HorsenamesExcelUpload />
            </div>
        </div>
    </PageContainer>
  )
}