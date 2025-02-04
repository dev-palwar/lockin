// "use server";

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function getArcById(arcId: string) {
//   try {
//     const data = await prisma.arc.findUnique({
//       where: {
//         id: arcId,
//       },
//     });

//     return { success: true, data };
//   } catch (error) {
//     console.log("sorry dost there's an error somewhere" + error);
//     return { error: "sorry dost there's an error somewhere" };
//   }
// }
