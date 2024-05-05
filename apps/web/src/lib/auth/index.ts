import { DefaultUser } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../../utils/db/schema.ts";
import { LogSnag } from "@logsnag/node";

const logsnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN!,
  project: "uhmarlondev",
});

declare module "next-auth" {
  interface Session {
    user: DefaultUser & { id: string } & { sessionToken: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    sessionToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },

    jwt: async ({ user, token, isNewUser }) => {
      if (isNewUser) {
        await logsnag.track({
          channel: "gtt",
          event: "New user created",
          description: `New user created with ID`,
          icon: "🆕",
          notify: true,
        });
      }
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
