import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  // Configuring authentication providers
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
  theme: { colorScheme: "light" },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),

  // disabled to let any user to visit site, at least in readonly mode:

  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     const isAllowedToSignIn = adminEmails.includes(user.email as string);

  //     if (isAllowedToSignIn) {
  //       return true;
  //     } else {
  // Return false to display a default error message
  //       return false;
  //     }
  //   },
  // },
};
