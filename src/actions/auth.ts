"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import crypto from "crypto";

const prisma = new PrismaClient();

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export async function loginTeacher(username: string, password: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { username },
    });

    if (!teacher || teacher.password !== hashPassword(password)) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // Use Next.js cookies to set session
    // In production, use JWT. For MVP, we set a simple cookie with teacher ID.
    const cookieStore = await cookies();
    cookieStore.set("teacherId", teacher.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
  }
}

export async function logoutTeacher() {
  const cookieStore = await cookies();
  cookieStore.delete("teacherId");
  return { success: true };
}

export async function getLoggedTeacher() {
  const cookieStore = await cookies();
  const teacherId = cookieStore.get("teacherId")?.value;
  if (!teacherId) return null;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { id: true, name: true, role: true, username: true },
  });

  return teacher;
}
