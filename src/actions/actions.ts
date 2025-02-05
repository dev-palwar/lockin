"use server";

import { Arc, Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function createArc(
  name: string,
  totalDays: number,
  userId: string
) {
  try {
    const data = await prisma.arc.create({
      data: {
        name,
        totalDays,
        userId: userId,
        dpOfArc: "",
        days: [],
      } as Prisma.ArcUncheckedCreateInput,
    });

    console.log("Arc created " + JSON.stringify(data, null, 2));

    return { success: true, data };
  } catch (error) {
    console.log("sorry dost there's an error somewhere" + error);
    return { error: "sorry dost there's an error somewhere" };
  }
}

export async function getAllArcsOfUsersFromDb(
  userId: string
): Promise<
  { success: true; data: Arc[] } | { success: false; error: unknown }
> {
  try {
    const response = await prisma.arc.findMany({ where: { userId } });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getArcById(arcId: string, userId: string) {
  try {
    const data = await prisma.arc.findUnique({
      where: {
        id: arcId,
        userId: userId,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.log("sorry dost there's an error somewhere" + error);
    return { error: "sorry dost there's an error somewhere" };
  }
}

interface temp {
  data: {
    arcId: string;
    userId: string;
    dayId: string;
    tasks: string[];
  };
}

export async function addTasksToDay({ data }: temp): Promise<{
  success: boolean;
  message: string;
  data: Arc | null | unknown;
}> {
  console.log(
    "Running addTasksToDay with the data : 🚀 " + JSON.stringify(data)
  );

  try {
    const arcData = await getArcById(data.arcId, data.userId);

    if (!arcData.data) {
      return {
        success: false,
        message: "kayde mein rahiye chhote",
        data: null,
      };
    }

    const taskObjects = data.tasks.map((task: string) => ({
      title: task,
      status: false,
    }));

    // check if the day exists
    const dayExists = arcData.data?.days.find((day) => day.id === data.dayId);

    let response;

    if (dayExists) {
      console.log("tasks being added : " + JSON.stringify(taskObjects));

      response = await prisma.arc.update({
        where: { id: data.arcId },
        data: {
          days: {
            set: arcData.data?.days.map((day) =>
              day.id === data.dayId ? { ...day, tasks: [...taskObjects] } : day
            ),
          },
        },
      });
    } else {
      console.log("day does not exists");
      console.log(
        "creating a new day with tasks : " + JSON.stringify(taskObjects)
      );

      const newDay = {
        id: uuidv4(),
        date: new Date(),
        name: "New Day",
        image: null,
        tasks: taskObjects,
        successRate: 0,
      };

      response = await prisma.arc.update({
        where: { id: data.arcId },
        data: {
          days: {
            push: newDay,
          },
        },
      });
    }

    return {
      success: true,
      message: "Tasks added successfully",
      data: response,
    };
  } catch (error) {
    return { success: false, message: "Something went wrong", data: error };
  }
}
