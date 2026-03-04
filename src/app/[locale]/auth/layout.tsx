import { ReactNode } from "react";

import AuthHeader from "@/features/auth/components/header/AuthHeader";
import SideContent from "@/features/auth/components/side-content/SideContent";



const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthHeader />
      <main className="md:grid grid-cols-2 bg-background h-[calc(100vh-75px)]">
        <SideContent />
        <div className="overflow-y-auto">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
