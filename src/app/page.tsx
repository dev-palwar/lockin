"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  if (session.status == "unauthenticated") {
    router.push("/login");
  }

  return (
    <div>
      Yoooo, {session?.data?.user?.name}
      <Button onClick={() => signOut()}>logout</Button>
    </div>
  );
}
