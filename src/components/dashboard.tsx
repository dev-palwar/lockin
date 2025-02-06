"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Arc, Day } from "@prisma/client";
import { TasksList } from "./task-list";

interface Props {
  data: Arc | null | undefined;
}

export default function Dashboard(props: Props) {
  if (!props.data?.id) return <div>Loading...</div>;

  const [open, setOpen] = React.useState(false);
  const [dayData, setDayData] = React.useState<Day | null>(null);

  const handleItemClick = (day: Day) => {
    setDayData(day);
    setOpen(true);
  };

  return (
    <div className="h-full w-full bg-[#1A1A1D] p-8 min-h-screen flex justify-center">
      <div className="flex flex-col w-[80%] gap-4 p-4 h-fit items-center">
        <div className="mb-6 text-start">
          <h2 className="text-white/80 text-5xl capitalize">
            {props.data.name}
          </h2>
        </div>

        {/* Grid for buttons */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              15,
              props.data.days.length
            )}, 1fr)`,
          }}
        >
          {props.data.days.map((day, index) => (
            <button
              key={index}
              className={`w-12 h-12 border border-white/20 rounded-sm hover:bg-white/10 transition-colors ${
                day.tasks.length > 0 ? "bg-green-50" : ""
              }`}
              onClick={() => handleItemClick(day)}
            />
          ))}
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div>
                <TasksList data={dayData} />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
