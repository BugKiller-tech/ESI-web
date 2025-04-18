import LocalStorageRemover from "@/components/LocalStorageRemover"

export default async () => {


    return (
        <div>
            <div className="text-4xl text-main-color">Thanks for your purchase</div>
            <div className="text-2xl mt-5">
                will be done within 3~5 business days.
            </div>

            <LocalStorageRemover storageKey="cart" />
        </div>
    )
}