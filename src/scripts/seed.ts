import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.userData.create({
    data: {
      name: "Devkinandan",
      dp: "https://example.com/profile.png",
      arcs: {
        create: [
          {
            name: "Arc 1",
            dpOfArc: "https://example.com/arc1.png",
            totalDays: 10,
            days: {
              create: [
                {
                  date: new Date(),
                  name: "Day 1",
                  dp: "https://example.com/day1.png",
                  tasks: {
                    create: [
                      { title: "Task 1", status: true },
                      { title: "Task 2", status: false },
                    ],
                  },
                  successRate: 50.0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("User with data created: ", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
