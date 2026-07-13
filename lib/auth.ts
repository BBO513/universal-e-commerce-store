import NextAuth, { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserRole, getUserByEmail } from "./db"; // Import getUserRole and getUserByEmail

interface AuthToken extends JWT {
  id?: string;
  role?: string;
}

export const users: Array<{ id: string; name: string; email: string; password: string }> = [];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);

        if (passwordMatch) {
          return { id: user.id.toString(), name: user.name, email: user.email, role: user.role };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }): Promise<AuthToken> {
      const authToken = token as AuthToken;
      if (user) {
        authToken.id = user.id;
        authToken.role = (user as any).role;
      }
      return authToken;
    },
    async session({ session, token }) {
      const authToken = token as AuthToken;
      if (session.user) {
        if (authToken.id) {
          (session.user as any).id = authToken.id;
        }
        if (authToken.role) {
          (session.user as any).role = authToken.role;
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);