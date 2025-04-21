import LocalStorageRemover from "@/components/LocalStorageRemover"

export default async () => {


    return (
        <div>
            <div className="text-4xl text-main-color">Thank you for your purchase</div>
            <div className="text-2xl mt-5 flex flex-col gap-3">
                <div>Digital Images will be sent within 72 hours via email</div>
                <div>Allow upto 4 weeks for printed products</div>
            </div>

            <LocalStorageRemover storageKey="cart" />
        </div>
    )
}