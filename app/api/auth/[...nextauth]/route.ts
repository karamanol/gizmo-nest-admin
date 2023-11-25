import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, {
  AuthOptions,
  NextAuthOptions,
  getServerSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["karamanoleksii@gmail.com"];

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET_ID ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = adminEmails.includes(user.email as string);

      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export const isAdmin = async (authOpt: AuthOptions) => {
  const session = await getServerSession(authOpt);
  if (!adminEmails.includes(session?.user?.email as string)) {
    throw new Error("You must be an admin to do that action");
  }
};

export { handler as GET, handler as POST, authOptions };
