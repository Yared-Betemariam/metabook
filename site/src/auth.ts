import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { users } from "./db/schema";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      try {
        console.log("runnign ath");
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email as string));

        if (!user) return token;

        token.sub = user.id.toString();
        token.email = user.email;
        token.name = user.name;

        return token;
      } catch (error) {
        console.log(error);
        return token;
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log("runnign ath");
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, profile?.email as string));

          if (!user) {
            await db.insert(users).values({
              email: account.email as string,
              name: account.name as string,
            });
            return true;
          }

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
