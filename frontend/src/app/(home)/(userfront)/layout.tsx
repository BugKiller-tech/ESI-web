
import NavigationBar from './navigation-bar'
import BreadcrumbNav from './breadcrumb'

export default ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='h-screen flex flex-col bg-gray-50'>
            <NavigationBar />
            <div className='py-2 md:py-5 flex-1 overflow-auto px-2 xl:px-5  flex flex-col'>
                {/* <BreadcrumbNav /> */}
                {children}
            </div>
        </div>
    )
}
