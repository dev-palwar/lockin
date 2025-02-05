"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  createArc,
  getAllArcsOfUsersFromDb,
  getArcById,
} from "@/actions/actions";
import { Arc } from "@prisma/client";

export interface NewArc {
  name: string;
  totalDays: number;
}

export default function ArcPage() {
  const session = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newArc, setNewArc] = useState<NewArc>({ name: "", totalDays: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [usersArcs, setUsersArcs] = useState<Arc[] | null>(null);

  // Handles redirect
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }

    if (session.status === "authenticated") {
      getUsersArcs();
    }
  }, [session.status, router]);

  // Loading state
  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  // Prevents rendering if not authenticated
  if (session.status !== "authenticated") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createArc(
        newArc.name,
        newArc.totalDays,
        session.data.user.id
      );

      if (result?.success) {
        toast({ title: "LFGGG!" });
        router.push(`/arc/${result.data.id}`);
      } else {
        toast({ title: result?.error || "Failed to create arc" });
      }
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const getUsersArcs = async () => {
    try {
      const response = await getAllArcsOfUsersFromDb(session.data.user.id);
      if (response.success) setUsersArcs(response.data);
      else toast({ title: "Failed to fetch arcs" });
    } catch (error) {
      toast({ title: "Unexpected error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4 p-4">
        <Button onClick={() => setIsOpen(true)} className="w-[20rem] h-12">
          New Arc
        </Button>
        {usersArcs
          ? usersArcs?.map((arc) => {
              return (
                <Button
                  key={arc.id}
                  className="w-full"
                  variant={"outline"}
                  onClick={() => router.push(`/arc/${arc.id}`)}
                >
                  {arc.name}
                </Button>
              );
            })
          : "loading prev arcs..."}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-[#121212] text-white">
            <DialogTitle className="sr-only">Create a new arc</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-lg font-normal">
                  Enter your arc
                </Label>
                <Input
                  className="bg-transparent border-0 border-b border-white rounded-none focus-visible:ring-0 focus-visible:border-white text-white placeholder:text-zinc-400"
                  value={newArc.name}
                  onChange={(e) =>
                    setNewArc({ ...newArc, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-lg font-normal">
                  Time duration (in days)
                </Label>
                <Input
                  type="number"
                  className="bg-transparent border-0 border-b border-white rounded-none focus-visible:ring-0 focus-visible:border-white text-white placeholder:text-zinc-400"
                  value={newArc.totalDays || ""}
                  onChange={(e) =>
                    setNewArc({
                      ...newArc,
                      totalDays: Number.parseInt(e.target.value),
                    })
                  }
                  required
                  min="1"
                />
              </div>
              <Button type="submit" className="w-full">
                {!loading ? "Create arc" : "loading..."}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
