"use server";

import { PrismaClient } from "@prisma/client";
import { getLoggedTeacher } from "./auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function approveRequest(formData: FormData) {
  const teacher = await getLoggedTeacher();
  if (!teacher) return { success: false, error: "Unauthorized" };

  const requestId = formData.get("requestId") as string;
  const points = parseInt(formData.get("points") as string, 10);

  if (!requestId || isNaN(points) || points <= 0) {
    return { success: false, error: "ข้อมูลไม่ถูกต้อง" };
  }

  try {
    const request = await prisma.deedRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.status !== "PENDING") {
      return { success: false, error: "ไม่พบคำขอ หรือคำขอนี้ถูกจัดการไปแล้ว" };
    }

    if (request.teacherId !== teacher.id && teacher.role !== "ADMIN") {
      return { success: false, error: "ไม่มีสิทธิ์อนุมัติคำขอนี้" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update request status
      await tx.deedRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          pointsAwarded: points,
          approvedAt: new Date(),
        },
      });

      // 2. Add points to student
      await tx.student.update({
        where: { id: request.studentId },
        data: {
          currentPoints: { increment: points },
        },
      });

      // 3. Create transaction log
      await tx.pointTransaction.create({
        data: {
          amount: points,
          type: "EARNED",
          description: `อนุมัติความดี: ${request.description}`,
          studentId: request.studentId,
          teacherId: teacher.id,
        },
      });
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Approve error:", error);
    return { success: false, error: "เกิดข้อผิดพลาด" };
  }
}

export async function rejectRequest(formData: FormData) {
  const teacher = await getLoggedTeacher();
  if (!teacher) return { success: false, error: "Unauthorized" };

  const requestId = formData.get("requestId") as string;

  try {
    await prisma.deedRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        approvedAt: new Date(),
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reject error:", error);
    return { success: false, error: "เกิดข้อผิดพลาด" };
  }
}
