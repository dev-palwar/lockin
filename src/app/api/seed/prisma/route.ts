import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Test database connection
    await prisma.$connect();

    // Create test data
    const testUser = await prisma.userData.create({
      data: {
        name: "Test User",
        email: "test@prisma.com",
        image: "/test-image.jpg",
        arcs: {
          create: {
            name: "Test Arc",
            dpOfArc: "/arc-dp.jpg",
            totalDays: 1,
            days: {
              create: {
                date: new Date(),
                name: "Test Day",
                successRate: 100,
                tasks: {
                  create: {
                    title: "Test Task",
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        arcs: {
          include: {
            days: {
              include: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: testUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
