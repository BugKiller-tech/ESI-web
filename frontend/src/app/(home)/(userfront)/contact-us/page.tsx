'use client'
import { useForm } from "react-hook-form";
// import { Input } from '@/components/ui/input';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import { toast } from 'sonner';
import * as APIs from '@/apis';


export default () => {

    const fullScreenLoader = useFullScreenLoader();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data: any) => {
        try {
            console.log(data);
            // Handle form submission logic here
            fullScreenLoader.showLoader();
            const response = await APIs.sendContactUsInfo(data);
            console.log(data);
            toast.success('Successfully sent your message.')
        } catch (error) {
            console.log('sending email error on contact us', error);
            toast.error('Failed to send an eamil for contact us form');
        } finally {
            fullScreenLoader.hideLoader();
        }
    };
    const onError = (errors: any) => {
        console.log(errors);
        // Handle form validation errors here
        toast.error('Failed to send your contact us info. Please try again later.')
    };
    

    return (
        <div>
            <h1 className="text-main-color text-3xl md:text-5xl font-bold mb-5">
                GET IN TOUCH
            </h1>
            <div className="text-main-text text-xl md:text-2xl mb-5">
                Please fill out form below to get in touch with us.
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