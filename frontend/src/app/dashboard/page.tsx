import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';

export default async function Dashboard() {
  const session = await auth();

  // if (!session?.user || session?.user?.isAdmin !== 1) {
  //   return redirect('/auth/signin');
  // } 
  // else {
  //   console.log('no loggedin user really..')
  //   // redirect('/dashboard/overview');
  // }
  return (
    <PageContainer>
        <div className="flex-grow">
            <h2 className='text-2xl font-bold tracking-tight mb-5'>
                Welcome to admin dashboard
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <p>User: { session.user?.email }</p>
              </div>
            </div>
        </div>
    </PageContainer>
  )
}
