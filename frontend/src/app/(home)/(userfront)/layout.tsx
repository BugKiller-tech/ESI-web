
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
            <div className='px-3 md:px-5 xl:px-15 flex-1 overflow-auto'>
                <div className='container mx-auto mt-5'>
                    <BreadcrumbNav />
                    { children }
                </div>
            </div>
        </div>
    )
}
