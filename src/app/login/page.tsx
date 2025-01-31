"use client";
import { Button } from "@/components/ui/button";
import { LucideGithub } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const session = useSession();

  if (session.status == "authenticated") {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br">
      <Button
        className="w-[13%]"
        variant="outline"
        onClick={() => signIn("github")}
      >
        <LucideGithub className="mr-2 h-4 w-4" />
        Sign in with GitHub
      </Button>
    </div>
  );
}
