import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addTasksToDay } from "@/actions/actions";
import { Day } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useArcStore } from "@/store/arc-store";
import { Checkbox } from "./ui/checkbox";

interface TasksListProps {
  data: Day;
}

export const TasksList: React.FC<TasksListProps> = ({ data }) => {
  const params = useParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { causeReRender } = useArcStore();

  const [inputValues, setInputValues] = useState<string[]>(
    data.tasks.length > 0 ? data.tasks.map((task) => task.title) : [""]
  );

  const [taskStatus, setTaskStatus] = useState<boolean[]>(
    data.tasks.length > 0 ? data.tasks.map((task) => task.status) : [false]
  );

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, inputValues.length);
  }, [inputValues]);

  const formHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = inputValues.map((val) => val.trim()).filter(Boolean);

    if (values.length === 0) return;

    const response = await addTasksToDay({
      data: {
        arcId: params.arcId as string,
        dayId: data.id,
        tasks: values,
        userId: session?.user.id as string,
        taskStatus,
      },
    });

    if (response.success) {
      causeReRender();
    }

    toast({ title: response.message });
  };

  const keyHandler = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInputValues((prev) => [...prev, ""]);
      // setTaskStatus((prev) => [...prev, false]);
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }

    if (
      event.key === "Backspace" &&
      inputValues[index] === "" &&
      inputValues.length > 1
    ) {
      event.preventDefault();
      setInputValues((prev) => prev.slice(0, -1));
      setTaskStatus((prev) => prev.slice(0, -1));
      setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const handleCheckboxChange = (index: number) => {
    const newStatus = [...taskStatus];
    newStatus[index] = !newStatus[index];
    setTaskStatus(newStatus);

    // Log the updated status to the console
    console.log(`Task ${index + 1} status: ${newStatus[index]}`);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold pb-4">{data.name}</h1>
      <form className="flex flex-col gap-4" onSubmit={formHandler}>
        {inputValues.map((value, index) => (
          <div className="flex justify-center items-center" key={index}>
            <Checkbox
              checked={taskStatus[index]}
              onCheckedChange={() => handleCheckboxChange(index)}
            />
            <Input
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              value={value}
              variant="ghost"
              placeholder="Enter task..."
              onKeyDown={(e) => keyHandler(e, index)}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{
                textDecoration: taskStatus[index] ? "line-through" : "none",
              }}
            />
          </div>
        ))}
        <Button type="submit" className="w-full">
          Add
        </Button>
      </form>
    </div>
  );
};
