"use client";

import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
