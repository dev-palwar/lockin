"use server";

import { Prisma, PrismaClient } from "@prisma/client";

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
      } as Prisma.ArcUncheckedCreateInput,
    });

    console.log("Arc created " + JSON.stringify(data, null, 2));

    return { success: true };
  } catch (error) {
    console.log("sorry dost there's an error somewhere" + error);
    return { error: "sorry dost there's an error somewhere" };
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
    console.log("sorry dost there's an error somewhere" + error);
    return { error: "sorry dost there's an error somewhere" };
  }
}
