
import NavigationBar from './navigation-bar'

export default ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='h-screen flex flex-col'>
            <NavigationBar />
            <div className='p-3 md:p-5 xl:p-10 flex-1 overflow-auto'>
                { children }
            </div>
        </div>
    )
}
