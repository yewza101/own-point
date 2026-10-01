"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getLoggedTeacher } from "./auth";

const prisma = new PrismaClient();

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export async function addTeacherAction(name: string, username: string, passwordRaw: string) {
  const currentTeacher = await getLoggedTeacher();
  if (currentTeacher?.role !== "ADMIN") return { success: false, error: "ไม่มีสิทธิ์ (เฉพาะแอดมินหลักเท่านั้น)" };

  try {
    const existing = await prisma.teacher.findUnique({ where: { username } });
    if (existing) return { success: false, error: "ชื่อผู้ใช้นี้มีในระบบแล้ว" };

    await prisma.teacher.create({
      data: {
        name,
        username,
        password: hashPassword(passwordRaw),
        role: "TEACHER",
      },
    });

    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "เพิ่มข้อมูลล้มเหลว" };
  }
}

export async function deleteTeacherAction(id: string) {
  const currentTeacher = await getLoggedTeacher();
  if (currentTeacher?.role !== "ADMIN") return { success: false, error: "ไม่มีสิทธิ์" };

  try {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (teacher?.role === "ADMIN") return { success: false, error: "ไม่สามารถลบแอดมินหลักได้" };

    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (error) {
    return { success: false, error: "ลบข้อมูลล้มเหลว" };
  }
}
