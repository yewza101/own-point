"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function setStudentSession(studentId: string) {
  const cookieStore = await cookies();
  cookieStore.set("studentId", studentId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day for students
    path: "/",
  });
  return { success: true };
}

export async function getLoggedStudent() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("studentId")?.value;
  if (!studentId) return null;

  return await prisma.student.findUnique({
    where: { id: studentId },
  });
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete("studentId");
}
