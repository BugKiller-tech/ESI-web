import { Metadata } from "next";
import SignupViewPage from '@/features/auth/components/signup-view';


export const metadata: Metadata = {
    title: 'Authentication | Sign up',
    description: 'ESI sign up page',
}


export default async function Page () {
    return (
        <SignupViewPage />
    )
}