"use server";

import { PrismaClient } from "@prisma/client";
import { getLoggedTeacher } from "./auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function useStudentPoints(studentId: string, pointsToUse: number, description: string) {
  const teacher = await getLoggedTeacher();
  if (!teacher) return { success: false, error: "Unauthorized" };

  if (!studentId || isNaN(pointsToUse) || pointsToUse <= 0 || !description) {
    return { success: false, error: "ข้อมูลไม่ถูกต้อง" };
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return { success: false, error: "ไม่พบนักเรียน" };
    }

    if (student.currentPoints < pointsToUse) {
      return { success: false, error: "คะแนนคงเหลือไม่พอ" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Deduct points from student
      await tx.student.update({
        where: { id: studentId },
        data: {
          currentPoints: { decrement: pointsToUse },
          usedPoints: { increment: pointsToUse },
        },
      });

      // 2. Create transaction log
      await tx.pointTransaction.create({
        data: {
          amount: pointsToUse,
          type: "USED",
          description: description,
          studentId: studentId,
          teacherId: teacher.id,
        },
      });
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Use points error:", error);
    return { success: false, error: "เกิดข้อผิดพลาด" };
  }
}
