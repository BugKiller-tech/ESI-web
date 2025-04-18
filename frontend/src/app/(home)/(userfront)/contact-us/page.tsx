'use client'
import { useForm } from "react-hook-form";
// import { Input } from '@/components/ui/input';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import { toast } from 'sonner';


export default () => {

    const fullScreenLoader = useFullScreenLoader();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data: any) => {
        console.log(data);
        // Handle form submission logic here
        fullScreenLoader.showLoader();

        function dummyCode () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 2000); // Simulate a 2-second delay
            });
        }
        await dummyCode();

        fullScreenLoader.hideLoader();
        toast.success('Successfully sent your message.')
    };
    const onError = (errors: any) => {
        console.log(errors);
        // Handle form validation errors here
    };
    

    return (
        <div>
            <h1 className="text-main-color text-4xl font-bold mb-5">
                GET IN TOUCH
            </h1>
            <div className="text-main-text text-2xl mb-5">
                Email us at Esihorseshowphotography@gmail.com
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
                    <input type="text" placeholder="Your Name" {...register("name", { required: true })} className="border border-gray-300 p-2 rounded" />
                    {errors.name && <span className="text-red-500">This field is required</span>}
                    
                    <input type="email" placeholder="Your Email" {...register("email", { required: true })} className="border border-gray-300 p-2 rounded" />
                    {errors.email && <span className="text-red-500">This field is required</span>}

                    <input type="text" placeholder="Subject" {...register("subject", { required: true })} className="border border-gray-300 p-2 rounded" />
                    {errors.subject && <span className="text-red-500">This field is required</span>}
                    
                    <textarea placeholder="Your Message" {...register("message", { required: true })} className="border border-gray-300 p-2 rounded h-32"></textarea>
                    {errors.message && <span className="text-red-500">This field is required</span>}
                    
                    <button type="submit" className="bg-main-color text-white py-2 px-4 rounded">Send Message</button>
                </form>
            </div>
        </div>
    )
}