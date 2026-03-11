import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Hardcoded admin credentials for demo purposes
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bookease.app';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Simple credential check (no database required)
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return {
            id: 'admin',
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
});
