"use client";

import { Arc } from "@/app/page";

interface Props extends Arc {}

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "./ui/checkbox";

export default function Dashboard(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

  // Create an array of 60 items (5 rows x 12 columns)
  const gridItems = Array.from({ length: props.totalDays }, (_, i) => i);

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-6">
        <h2 className="text-white/80 text-xl">{props.name}</h2>
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

const TasksList: React.FC = () => {
  return (
    <div className="flex space-x-2">
      {" "}
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
};
