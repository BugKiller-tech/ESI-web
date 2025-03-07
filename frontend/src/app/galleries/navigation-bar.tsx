'use client'

export default () => {
    const goGallery = () => {
        console.log('testing')
    }

    return (
        <div className='p-3 md:p-5 xl:p-10 bg-secondary flex gap-3'>
            <div className="font-bold text-2xl cursor-pointer"
            onClick={goGallery}>
                ESI
            </div>
            <div className="flex-1"></div>
            <div className="cursor-pointer">
                {/* Guest */}
            </div>
        </div>
    )
}