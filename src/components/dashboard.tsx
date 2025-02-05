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
import { Arc, Day } from "@prisma/client";
import { TasksList } from "./task-list";

export default function Dashboard(props: Props) {
  if (!props.data?.id) return <div>Loading...</div>;

  const [open, setOpen] = React.useState(false);
  const [dayData, setDayData] = React.useState<Day | null>(null);

  const handleItemClick = (day: Day) => {
    setDayData(day);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-6">
        <h2 className="text-white/80 text-xl">{props.data.name}</h2>
      </div>

      {props.data.days == undefined ? (
        "create days"
      ) : (
        <>
          <div className="grid grid-cols-12 gap-2">
            {props.data.days.map((day, index) => (
              <button
                key={index}
                className="aspect-square border border-white/20 rounded-sm hover:bg-white/10 transition-colors"
                onClick={() => handleItemClick(day)}
              />
            ))}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                {/* <DialogTitle className="mb-4">Grid Item {selectedItem}</DialogTitle> */}
                <div>
                  <TasksList data={dayData} />
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
