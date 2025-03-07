import PageContainer from "@/components/layout/page-container"
import ImageSettings  from "./components/image-settings"

export default async () => {
    return (
        <PageContainer>
            <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                    Settings Admin Page
                </h2>
                <ImageSettings />
            </div>
        </PageContainer>
    )

}