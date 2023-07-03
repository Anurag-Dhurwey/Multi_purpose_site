import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Providers from 'next-auth/providers'
import { v4 as uuidv4 } from 'uuid';
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // CredentialsProvider({
    //   name: "Email",
    //   credentials: {
    //     username: {
    //       label: "User name",
    //       type: "string",
    //       placeholder: "User name",
    //       required:true
    //     },
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "example@example.com",
    //       required:true
    //     },
    //     password: { label: "Password", type: "password" , required:true},
    //   },
    //   async authorize(credentials) {
    //     const user = { id: uuidv4(), name: credentials?.username, email: credentials?.email,pass:credentials?.password };
    //     return user;
    //   },
    // }),
    GitHubProvider({
      clientId: `${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET}`
    }),
    GoogleProvider({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`
    }),
    FacebookProvider({
      clientId: `${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET}`
    }),
  ],
};

