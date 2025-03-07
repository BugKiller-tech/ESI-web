import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  return; // we don't need any login temporarily

  if (!session?.user) {
    return redirect('/auth/signin');
  } else {
    console.log('no loggedin user really..')
    // redirect('/dashboard/overview');
  }
}
