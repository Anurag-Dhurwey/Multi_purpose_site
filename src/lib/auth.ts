import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Providers from 'next-auth/providers'
import { v4 as uuidv4 } from 'uuid';
import {client} from '../lib/sanityClient'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // CredentialsProvider({
    //   name: "Email",
    //   credentials: {
    //     name: {
    //       label: "Name",
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
    //     const user = { id: uuidv4(), name: credentials?.name, email: credentials?.email,password:credentials?.password };
    //     return user;
    //   },
    // }),
    
    // SanityCredentials(client,'user') ,
    GitHubProvider({
      clientId: `${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET}`
    }),
    GoogleProvider({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`
    }),
    // FacebookProvider({
    //   clientId: `${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}`,
    //   clientSecret: `${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET}`
    // }),
  ],
  adapter: SanityAdapter(client,{
    schemas: {
      verificationToken: 'verification-token',
      account: 'account',
      user: 'user'
    }
  }),
  callbacks: {
    async jwt({ token, account }) {
   
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    // async session({ session, token, user }) {
    //   // Send properties to the client, like an access_token from a provider.
    //   session.accessToken = token.accessToken
    //   return session
    // },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }
};



