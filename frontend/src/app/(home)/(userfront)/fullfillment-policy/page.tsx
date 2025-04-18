

export const metadata = {
    title: 'Fulfillment Policy',
}

export default () => {
    return (
        <div
            // className="px-2 md:px-12 lg:px-24"
        >
            <h1 className="text-5xl font-bold mb-10 text-main-color">
                Fulfillment policy
            </h1>
            <div className="text-3xl text-gray-700">
                All digital photos will be delivered via email within 72 hours of order <br/>
                All print orders will be delivered via USPS within 4 weeks.<br/>
                <br/>
                <div className="font-bold mb-2">Refunds/Replacement images.</div>
                If you receive an image other than the one specified on your invoice we will replace it with the correct image and if you receive a damaged print we will replace it with a duplicate.
            </div>
        </div>
    )
}