import AuthButton from "../components/AuthButton";
import { getServerSession } from "next-auth";
import Navigation from "@/components/Navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Toaster } from "react-hot-toast";

type LayoutProps = { children: React.ReactNode };

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session)
    return (
      <div className="flex items-center bg-gray-200 w-screen h-screen">
        <div className="text-center w-full">
          <AuthButton />
        </div>
      </div>
    );

  return (
    <div className="bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-400/80 to-orange-200 h-screen overflow-x-hidden flex ">
      <Navigation />
      <Toaster />
      <div className="bg-gray-100/50 flex-grow mt-2 mb-2 mr-2 rounded-xl p-4 border border-gray-200/10 drop-shadow-sm overflow-auto">
        {children}
      </div>
    </div>
  );
}
