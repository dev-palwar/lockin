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
    // Generate days array with sequential dates
    const dayArr = Array.from({ length: totalDays }, (_, i) => ({
      id: uuidv4(),
      date: new Date(new Date().setDate(new Date().getDate() + i)), // Incrementing dates
      name: `Day ${i + 1}`,
      image: null,
      tasks: [],
      successRate: null,
    }));

    const data = await prisma.arc.create({
      data: {
        name,
        totalDays,
        userId,
        dpOfArc: "",
        days: dayArr,
      } as Prisma.ArcUncheckedCreateInput,
    });

    console.log("Arc created", JSON.stringify(data, null, 2));
    return { success: true, data };
  } catch (error) {
    console.error("Error creating Arc:", error);
    return { error: "Sorry dost, there's an error somewhere." };
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

export async function getArcById(arcId: string) {
  try {
    const data = await prisma.arc.findUnique({
      where: {
        id: arcId,
      },
    });

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "sorry dost there's an error somewhere" + error,
    };
  }
}

export async function updateImageOfArc({
  imageUrl,
  arcId,
}: {
  imageUrl: string;
  arcId: string;
}) {
  try {
    const arc = getArcById(arcId);

    if (!arc) {
      return { success: false, message: "Arc not found" };
    }

    const updatedArc = await prisma.arc.update({
      where: {
        id: arcId,
      },
      data: {
        dpOfArc: imageUrl,
      },
    });

    return {
      success: true,
      message: "Image updated successfully",
      data: updatedArc,
    };
  } catch (error) {
    console.error("Error updating arc image:", error);
    return { success: false, message: "Failed to update image" };
  }
}

export async function updateNameOfArc(data: {
  updatedNameOfArc: string;
  idOfArc: string;
}) {
  try {
    const response = await getArcById(data.idOfArc);

    const updatedArc = await prisma.arc.update({
      where: { id: data.idOfArc },
      data: { name: data.updatedNameOfArc },
    });

    return {
      success: true,
      message: "Name updated successfully",
      data: updatedArc,
    };
  } catch (error) {
    return { success: false, message: "Failed to update name", error: error };
  }
}

interface temp {
  data: {
    arcId: string;
    userId: string;
    dayId: string;
    tasks: string[];
    taskStatus: boolean[];
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
    const arcData = await getArcById(data.arcId);

    if (!arcData.data) {
      return {
        success: false,
        message: "kayde mein rahiye chhote",
        data: null,
      };
    }

    const taskObjects = data.tasks.map((task: string, index: number) => ({
      title: task,
      status: data.taskStatus[index],
    }));

    console.log(taskObjects);

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
