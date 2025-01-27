"use client";
import { signIn } from "next-auth/react";

export default function GithubAuthButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/profile" })}
      className="bg-gray-800 text-white p-2 rounded"
    >
      Sign in with GitHub
    </button>
  );
}
