import NextAuth, { DefaultSession } from 'next-auth';

// declare module 'next-auth' {
//   type UserSession = DefaultSession['user'];
//   interface Session {
//     user: UserSession;
//   }

//   interface CredentialsInputs {
//     email: string;
//     password: string;
//   }
// }

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      isAdmin: number;
      accessToken: string;
    };
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: number;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    name: string;
    email: string;
    isAdmin: number;
    accessToken: string;
  }
}
