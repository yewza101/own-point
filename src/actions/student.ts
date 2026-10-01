"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addStudentsAction(classLevel: string, room: string, names: string[]) {
  try {
    const data = names.map(name => ({
      name,
      classLevel,
      room,
    }));

    await prisma.student.createMany({
      data,
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to add students:", error);
    return { success: false, error: "ไม่สามารถเพิ่มข้อมูลได้" };
  }
}

export async function getStudentsByClass(classLevel: string, room: string) {
  try {
    return await prisma.student.findMany({
      where: { classLevel, room },
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return [];
  }
}

export async function updateStudentAction(id: string, name: string, classLevel: string, room: string) {
  try {
    await prisma.student.update({
      where: { id },
      data: { name, classLevel, room },
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "แก้ไขข้อมูลล้มเหลว" };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    await prisma.student.delete({
      where: { id },
    });
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "ลบข้อมูลล้มเหลว" };
  }
}
