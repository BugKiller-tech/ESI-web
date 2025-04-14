
import NavigationBar from './navigation-bar'
import BreadcrumbNav from './breadcrumb'

export default ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='h-screen flex flex-col bg-gray-300'>
            <NavigationBar />
            <div className='px-3 md:px-5 xl:px-10 flex-1 overflow-auto'>
                <BreadcrumbNav />
                <div className='mt-5'>
                    { children }
                </div>
            </div>
        </div>
    )
}
