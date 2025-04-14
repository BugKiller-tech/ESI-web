import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';

export default async function Dashboard() {
  const session = await auth();

  // if (!session?.user || session?.user?.isAdmin !== 1) {
  //   return redirect('/auth/signin');
  // } else {
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
                Please ignore info below because it's just for test purposes. <br />
                It will be removed later
              </div>
              <div>
                { JSON.stringify(session) }
              </div>
            </div>
        </div>
    </PageContainer>
  )
}
