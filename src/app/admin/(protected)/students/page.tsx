import { PrismaClient } from "@prisma/client";
import { getLoggedTeacher } from "@/actions/auth";
import AddStudentForm from "./AddStudentForm";
import StudentRow from "./StudentRow";

const prisma = new PrismaClient();

export default async function StudentsPage() {
  const teacher = await getLoggedTeacher();
  if (!teacher) return null;

  // Get all students
  const students = await prisma.student.findMany({
    orderBy: [
      { classLevel: "asc" },
      { room: "asc" },
      { name: "asc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">จัดการรายชื่อนักเรียน</h2>
        <AddStudentForm />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">รายชื่อนักเรียนทั้งหมด ({students.length} คน)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">ชั้น/ห้อง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">คะแนนคงเหลือ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
