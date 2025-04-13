import { NextAuthConfig, DefaultSession, UserObject } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
// import GithubProvider from 'next-auth/providers/github';




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

        if (email != 'admin@gmail.com' && password != 'admin') { // temp code 
          return new Error('Invalid credentials');
        }

        const user = {
          _id: '1',
          name: 'ESI Admin',
          email: credentials?.email as string,
          isAdmin: 1,
        };


        // function delay(ms: number) {
        //   return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // await delay(2000);


        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user as UserObject;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // First time login: add custom fields to token
      if (user) {
        token._id = user._id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.isAdmin = token.isAdmin as number;
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
