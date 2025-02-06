"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// TIL the layout.tsx is rendered only once in the component life cycle
// so you'll have to provide the dependency array to cause the re-render

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status, router]);

  return <main>{children}</main>;
}
