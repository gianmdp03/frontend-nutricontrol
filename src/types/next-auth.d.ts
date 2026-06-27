import NextAuth from "next-auth";

declare module "next-auth" {
  interface Profile {
    given_name?: string;
    family_name?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      lastname?: string;
      username?: string;
      role?: string;
      backendToken: string;
      timezone?: string;
    }
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    role?: string;
    backendToken?: string;
    timezone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    backendToken?: string;
    timezone?: string;
    username?: string;
  }
}