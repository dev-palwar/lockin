import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addTasksToDay } from "@/actions/actions";
import { Day } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const TasksList: React.FC<{
  data: Day;
}> = ({ data }) => {
  const params = useParams();
  const [inputBoxNumber, setInputBoxNumber] = React.useState<number>(1);
  const inputRefs = React.useRef<HTMLInputElement[]>([]);
  const [taskListString, setTaskListsString] = React.useState<string[]>([]);
  const [inputValues, setInputValues] = React.useState<string[]>(
    data.tasks.map((task) => task.title)
  ); // Initialize with existing tasks

  const { toast } = useToast();
  const { data: session } = useSession();

  const formHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Collect input values
    const values = inputRefs.current
      .map((input) => input?.value.trim())
      .filter((value) => value !== ""); // Filters out empty values

    setTaskListsString(values);

    if (values.length > 0) {
      await getInsertedData(values);
    }
  };

  const getInsertedData = async (values: string[]) => {
    const response = await addTasksToDay({
      data: {
        arcId: params.arcId as string,
        dayId: data.id,
        tasks: values,
        userId: session?.user.id as string,
      },
    });

    toast({ title: response.message });
  };

  const keyHandler = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInputBoxNumber((prev) => prev + 1);

      // Add a new empty value to the inputValues array
      setInputValues((prev) => [...prev, ""]);

      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }

    if (event.key === "Backspace") {
      const target = event.target as HTMLInputElement;
      if (target.value === "") {
        event.preventDefault();
        setInputBoxNumber((prev) => (prev > 1 ? prev - 1 : 1));

        // Remove the last value from the inputValues array
        setInputValues((prev) => prev.slice(0, -1));

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold underline pb-4">{data.name}</h1>
      <form className="flex flex-col gap-4" onSubmit={formHandler}>
        {inputValues.map((value, index) => (
          <Input
            value={value}
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            variant={"ghost"}
            placeholder="Enter stuff.."
            onKeyDown={(e) => keyHandler(e, index)}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}

        <Button type="submit" className="w-full">
          Add
        </Button>
      </form>
    </div>
  );
};
