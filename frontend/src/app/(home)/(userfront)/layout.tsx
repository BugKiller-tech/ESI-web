
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
            <div className='pt-5 flex-1 overflow-auto md:container mx-auto flex flex-col'>
                {/* <BreadcrumbNav /> */}
                {children}
            </div>
        </div>
    )
}
