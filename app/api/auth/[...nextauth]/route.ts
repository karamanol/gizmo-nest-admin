import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import AdminUser from "@/models/AdminUser";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Types } from "mongoose";
import NextAuth, {
  AuthOptions,
  NextAuthOptions,
  getServerSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
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

const handler = NextAuth(authOptions);

export type AdminUserType = {
  _id: Types.ObjectId;
  email: string;
};
export const isAdmin = async (authOpt: AuthOptions) => {
  await mongooseConnect();
  const session = await getServerSession(authOpt);
  const admins: AdminUserType[] = await AdminUser.find();
  const adminEmails = admins.map((admin) => admin.email);

  if (!adminEmails.includes(session?.user?.email as string)) {
    throw new Error("You must be an admin to do that action");
  }
};

export { handler as GET, handler as POST, authOptions };
