/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AuthService } from '@/services/auth-api';

declare module 'next-auth' {
  interface Session {
    token: string;
    role: string;
    id: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    token?: string;
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async signIn({ account }: { account: any }) {
      if (account?.provider === 'google') {
        try {
          const res = await AuthService.signInWithGoogle(account.id_token!);
          if (res) {
            return true;
          }
          return '/auth?error=google_signin';
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message;
          if (errorMessage?.includes('waitlist')) {
            return `/auth?error=${encodeURIComponent(errorMessage)}`;
          }
          return '/auth?error=google_signin';
        }
      }
      return false;
    },
    async jwt({ token, account }) {
      if (account?.provider === 'google') {
        const res = await AuthService.signInWithGoogle(account.id_token!);
        if (res) {
          token.token = res.token;
          token.role = res.user.role;
          token.id = res.user.id;
          token.name = `${res.user.firstName} ${res.user.lastName}`;
          token.image = res.user.avatarUrl;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.token = token.token;
      session.role = token.role;
      session.id = token.id;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
  },
  jwt: {
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
};

export const getSession = () => getServerSession(authOptions);
