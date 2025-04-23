import { NextAuthConfig, DefaultSession, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
// import GithubProvider from 'next-auth/providers/github';

import * as APIs from '@/apis';


// declare module "next-auth" {
//   export interface UserObject {
//     _id: string;
//     name: string;
//     email: string;
//     image?: string;
//     isAdmin: number;
//   }
//   interface Session {
//     user: UserObject
//   }
// }

const authConfig = {
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? '',
    //   clientSecret: process.env.GITHUB_SECRET ?? ''
    // }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        let user = null;
        let token = '';
        try {
          const response = await APIs.signIn({
            email: email,
            password: password,
          })

          if (response.data.user) {
            console.log('authed hehehe', response.data);
            user = response.data.user;
            token = response.data.accessToken;
          }

        } catch (error) {
          console.log(error);
        }


        // function delay(ms: number) {
        //   return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // await delay(2000);


        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          user.accessToken = token;
          console.log('TTTTTTTTTTTTTTT', user);
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          // return null;
          throw new Error('');
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First time login: add custom fields to token
      console.log('------------- jwt --------------');
      console.log('user is ', user);
      console.log('token is', token);
      if (user) {
        token._id = user._id;
        token.image = user.image;
        token.isAdmin = user.isAdmin;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.image = (token.image || '') as string;
        session.user.isAdmin = (token.isAdmin || 0) as number;
        session.user.accessToken = (token.accessToken) as string;
        console.log('in auth call back token', token);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
