import { PrismaClient } from "@prisma/client";
import { getLoggedTeacher } from "@/actions/auth";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function GET() {
  const teacher = await getLoggedTeacher();
  if (!teacher) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const students = await prisma.student.findMany({
      orderBy: [
        { classLevel: "asc" },
        { room: "asc" },
        { name: "asc" },
      ],
    });

    // Prepare data for Excel
    const excelData = students.map((student) => ({
      "ชั้น (ม.)": student.classLevel,
      "ห้อง": student.room,
      "ชื่อ-นามสกุล": student.name,
      "คะแนนที่ได้รับทั้งหมด": student.currentPoints + student.usedPoints,
      "คะแนนที่ใช้ไปแล้ว": student.usedPoints,
      "คะแนนคงเหลือ": student.currentPoints,
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายชื่อนักเรียนและคะแนน");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="students-points.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Failed to generate Excel", { status: 500 });
  }
}
