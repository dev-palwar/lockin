import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(user);

      try {
        if (!user.email || !user.name) {
          throw new Error("Missing required user fields from GitHub");
        }

        const newUser = await prisma.userData.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image as string,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image as string,
          },
        });

        user.id = newUser.id;
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in JWT token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
