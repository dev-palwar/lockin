"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Arc, Day } from "@prisma/client";
import { TasksList } from "./task-list";
import { useArcStore } from "@/store/arc-store";
import Image from "next/image";
import winterguts from "../assets/winterguts.jpg";
import { Input } from "./ui/input";
import { uploadImage } from "@/actions/uploadImage";
import { updateImageOfArc, updateNameOfArc } from "@/actions/actions";
import { useToast } from "@/hooks/use-toast";

interface Props {
  data: Arc | null | undefined;
}

export default function Dashboard(props: Props) {
  if (!props.data?.id) return <div>Loading...</div>;

  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [dayData, setDayData] = React.useState<Day | null>(null);
  const { tasksAdded } = useArcStore();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updatedArcData, setUpdatedArcData] = React.useState<Arc>();
  const [arcName, setArcName] = React.useState<string>(props.data.name); // State for arc name

  const handleItemClick = (day: Day) => {
    setDayData(day);
    setOpen(true);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      setLoading(true);
      const file = event.target.files[0];

      const { url } = await uploadImage(file);

      if (url) {
        try {
          const { data } = await updateImageOfArc({
            imageUrl: url,
            arcId: props.data?.id as string,
          });
          setUpdatedArcData(data);
          setLoading(false);
        } catch (error) {
          console.log("Error: " + error);
          setLoading(false);
        }
      }
    }
  };

  // Function to handle arc name change
  const handleArcNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newName = e.target.value;
    setArcName(newName); // Update local state
  };

  // Function to save the updated arc name
  const saveArcName = async () => {
    try {
      let response = await updateNameOfArc({
        idOfArc: props.data?.id as string,
        updatedNameOfArc: arcName,
      });

      if (response.success) {
        toast({ title: "ho gaya update 👍" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setOpen(false);
  }, [tasksAdded]);

  return (
    <div className="h-full w-full bg-[#1A1A1D] p-8 min-h-screen flex justify-center">
      <div className="flex flex-col w-[80%] gap-4 p-4 h-fit items-center">
        {/* Da box */}
        <div>
          {/* image of arc */}
          {loading ? (
            "loading..."
          ) : (
            <div className="w-fit mb-8">
              <input
                type="file"
                accept="image/*"
                hidden
                id="fileInput"
                onChange={handleFileChange}
              />
              <Image
                src={
                  updatedArcData
                    ? (updatedArcData.dpOfArc as string)
                    : (props.data.dpOfArc as string)
                }
                height={100}
                width={100}
                alt="Selected"
                className="rounded-[10%] border border-[#5F9EA0] cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              />
            </div>
          )}
          {/* Arc Name Input */}
          <Input
            type="text"
            variant={"ghost"}
            value={arcName}
            className="text-white/80 text-5xl capitalize px-2 py-1 mb-12 pl-0"
            style={{ fontSize: "2rem" }}
            onChange={handleArcNameChange}
            // onBlur={saveArcName} // Save on blur
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveArcName(); // Save on Enter key press
              }
            }}
          />
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
                className={`w-12 h-12 border border-white/20 rounded-sm hover:bg-white/10 transition-colors 
                ${day.tasks.length > 0 ? "bg-green-50" : ""} 
                ${
                  new Date(day.date).toDateString() ===
                  new Date().toDateString()
                    ? "bg-purple-500 text-white"
                    : ""
                }`}
                onClick={() => handleItemClick(day)}
              />
            ))}
          </div>
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
