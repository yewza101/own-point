"use server";

import { PrismaClient } from "@prisma/client";
import { getLoggedStudent } from "./studentAuth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitDeedRequest(teacherId: string, description: string) {
  const student = await getLoggedStudent();
  if (!student) return { success: false, error: "Unauthorized" };

  if (!description || !teacherId) {
    return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    await prisma.deedRequest.create({
      data: {
        description,
        teacherId,
        studentId: student.id,
      },
    });

    revalidatePath("/student/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Submit deed error:", error);
    return { success: false, error: "เกิดข้อผิดพลาด" };
  }
}
