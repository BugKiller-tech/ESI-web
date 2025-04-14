import { redirect } from "next/navigation"

export default async function () {
    redirect('/events/NY');

    return (
        <div>Redirecting to default state</div>
    )
}