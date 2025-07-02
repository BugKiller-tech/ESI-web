// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import * as APIs from '@/apis';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { auth } = req;
  const isAuthenticated = !!auth?.user;
  const isAdmin = auth?.user?.isAdmin;
  const path = req.nextUrl.pathname;

  if (!isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', req.nextUrl.pathname); // <-- Add original path
    return Response.redirect(url);
  }
  let goLogin = false;
  try {
    console.log('checking for user if it is logged in status=================================')
    const res = await APIs.getCurrentUser(auth?.user?.accessToken);
    if (res.data?.user?.isAdmin !== 1) {
      goLogin = true;
    }
  } catch (error) {
    goLogin = true;
    console.log(error);
  }

  if (goLogin) {
    return Response.redirect(new URL('/auth/signin', req.url));
  }


});

export const config = { matcher: ['/dashboard/:path*'] };
