import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
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

        console.log("User processed:", newUser);
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
