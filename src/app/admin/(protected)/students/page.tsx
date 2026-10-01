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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">รายชื่อนักเรียนทั้งหมด ({students.length} คน)</h2>
          <a 
            href="/api/export-students" 
            target="_blank"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ส่งออกเป็น Excel
          </a>
        </div>
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
