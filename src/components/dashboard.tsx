"use client";

interface Props {
  data: Arc | null | undefined;
}

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Arc, PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function Dashboard(props: Props) {
  if (!props.data?.id) return <div>Nothing to show here</div>;

  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

  // Create an array of 60 items (5 rows x 12 columns)
  const gridItems = Array.from({ length: props.data.totalDays }, (_, i) => i);

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-6">
        <h2 className="text-white/80 text-xl">{props.data.name}</h2>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {gridItems.map((item, index) => (
          <button
            key={index}
            className="aspect-square border border-white/20 rounded-sm hover:bg-white/10 transition-colors"
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4">Grid Item {selectedItem}</DialogTitle>
            <DialogDescription>
              <TasksList />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const prisma = new PrismaClient();

const TasksList: React.FC = () => {
  const [inputBoxNumber, setInputBoxNumber] = React.useState<number>(1);
  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  const { data } = useSession();

  const formHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputValues = inputRefs.current.map((input) => input?.value.trim());
    console.log("Input Data:", inputValues);

    // await prisma.arc
  };

  const keyHandler = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInputBoxNumber((prev) => prev + 1);

      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }

    if (event.key === "Backspace") {
      const target = event.target as HTMLInputElement;
      if (target.value === "") {
        event.preventDefault();
        setInputBoxNumber((prev) => (prev > 1 ? prev - 1 : 1));

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
  };

  return (
    <form action="" className="flex flex-col gap-4" onSubmit={formHandler}>
      {Array.from({ length: inputBoxNumber }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          variant={"ghost"}
          placeholder="Enter stuff.."
          onKeyDown={(e) => keyHandler(e, index)}
        />
      ))}
      <Button type="submit" className="w-full">
        Add
      </Button>
    </form>
  );
};
