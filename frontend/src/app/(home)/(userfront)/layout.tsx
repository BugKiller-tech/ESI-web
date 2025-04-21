
import NavigationBar from './navigation-bar'
import BreadcrumbNav from './breadcrumb'

export default ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='h-screen flex flex-col bg-gray-200'>
            <NavigationBar />
            <div className='px-3 flex-1 overflow-auto'>
                <div className='md:container mx-auto mt-5'>
                    <BreadcrumbNav />
                    <div className='mt-2 md:mt-3'>
                        { children }
                    </div>
                </div>
            </div>
        </div>
    )
}
