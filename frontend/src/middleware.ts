// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log('checkcheckcheck',req)
  const { auth } = req;
  const isLoggedIn = !!auth?.user;
  const isAdmin = auth?.user?.isAdmin;
  const path = req.nextUrl.pathname;
  
  if (!isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', req.nextUrl.pathname); // <-- Add original path
    return Response.redirect(url);
  }

  if (path.startsWith('/dashboard')) {
    if (isAdmin !== 1) {
      return Response.redirect(new URL('/auth/signin', req.url));
    }
  }
  
});

export const config = { matcher: ['/dashboard/:path*'] };
