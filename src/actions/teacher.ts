"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTeachersForDropdown() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        username: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return teachers;
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return [];
  }
}
