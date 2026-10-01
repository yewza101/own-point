import { PrismaClient } from "@prisma/client";
import { getLoggedStudent } from "@/actions/studentAuth";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function StudentDashboard() {
  const student = await getLoggedStudent();
  if (!student) return null;

  const transactions = await prisma.pointTransaction.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    include: { teacher: true },
  });

  const pendingRequests = await prisma.deedRequest.findMany({
    where: { studentId: student.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { teacher: true },
  });

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl p-6 text-white shadow-lg text-center transform transition-transform hover:scale-105">
          <p className="text-yellow-50 font-medium mb-1">คะแนนคงเหลือ</p>
          <p className="text-5xl font-black drop-shadow-md">{student.currentPoints}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md text-center border-2 border-gray-100 flex flex-col justify-center">
          <p className="text-gray-500 font-medium mb-1">คะแนนที่ใช้ไปแล้ว</p>
          <p className="text-3xl font-bold text-gray-700">{student.usedPoints}</p>
        </div>
      </div>

      {/* Add Point Button */}
      <Link href="/student/dashboard/add" className="block w-full">
        <div className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl p-6 shadow-lg text-center transform transition-all hover:-translate-y-1 active:translate-y-0 cursor-pointer">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-white drop-shadow-sm">+ เพิ่ม Own-Point</h2>
          <p className="text-pink-100 mt-2">รายงานความดีที่ได้ทำให้คุณครูรับรอง</p>
        </div>
      </Link>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
            กำลังรออนุมัติ ({pendingRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="text-sm p-3 bg-gray-50 rounded-lg flex justify-between">
                <span className="text-gray-600">{req.description}</span>
                <span className="text-gray-400 text-xs">ส่งถึงครู {req.teacher.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">ประวัติคะแนน</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">ยังไม่มีประวัติ</p>
        ) : (
          <div className="space-y-4">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(t.createdAt).toLocaleString("th-TH")} (รับรองโดย: {t.teacher.name})</p>
                </div>
                <div className={`font-bold text-lg ${t.type === "EARNED" ? "text-green-500" : "text-red-500"}`}>
                  {t.type === "EARNED" ? "+" : "-"}{t.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
