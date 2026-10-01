import { PrismaClient } from "@prisma/client";
import { getLoggedTeacher } from "@/actions/auth";
import { redirect } from "next/navigation";
import AddTeacherForm from "./AddTeacherForm";
import TeacherRow from "./TeacherRow";

const prisma = new PrismaClient();

export default async function TeachersPage() {
  const teacher = await getLoggedTeacher();
  if (!teacher || teacher.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const teachersList = await prisma.teacher.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-pink-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มรายชื่อคุณครู</h2>
        <AddTeacherForm />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">รายชื่อคุณครูทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">ตำแหน่ง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachersList.map((t) => (
                <TeacherRow key={t.id} teacher={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
