import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";
import { getLoggedTeacher } from "@/actions/auth";
import { approveRequest, rejectRequest } from "@/actions/points";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const teacher = await getLoggedTeacher();
  
  if (!teacher) return null;

  // Fetch pending deed requests
  const pendingRequests = await prisma.deedRequest.findMany({
    where: {
      teacherId: teacher.id,
      status: "PENDING",
    },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-yellow-400">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แดชบอร์ด (รายการรออนุมัติ)</h2>
      
      {pendingRequests.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">ไม่มีรายการรออนุมัติในขณะนี้ 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div key={req.id} className="border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-pink-50 transition-colors">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-gray-800">{req.student.name} (ม.{req.student.classLevel}/{req.student.room})</h3>
                <p className="text-gray-600 mt-1">ความดีที่ทำ: <span className="font-medium text-pink-600">{req.description}</span></p>
                <p className="text-xs text-gray-400 mt-2">เวลาส่ง: {new Date(req.createdAt).toLocaleString("th-TH")}</p>
              </div>
              
              <div className="flex gap-2">
                <form action={async (fd) => {
                  "use server";
                  await approveRequest(fd);
                }}>
                  <input type="hidden" name="requestId" value={req.id} />
                  <input type="number" name="points" defaultValue={10} className="w-20 border rounded p-2 text-center" min={1} required />
                  <button type="submit" className="ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors shadow-sm">
                    อนุมัติ
                  </button>
                </form>
                <form action={async (fd) => {
                  "use server";
                  await rejectRequest(fd);
                }}>
                  <input type="hidden" name="requestId" value={req.id} />
                  <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors shadow-sm">
                    ปฏิเสธ
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Section */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-md border-t-4 border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ประวัติการดำเนินการของคุณ</h2>
        
        <Suspense fallback={<p>กำลังโหลดข้อมูล...</p>}>
          <TeacherHistory teacherId={teacher.id} />
        </Suspense>
      </div>
    </div>
  );
}

async function TeacherHistory({ teacherId }: { teacherId: string }) {
  const history = await prisma.pointTransaction.findMany({
    where: { teacherId },
    include: { student: true },
    orderBy: { createdAt: 'desc' },
    take: 20, // Show last 20 actions
  });

  if (history.length === 0) {
    return <p className="text-gray-500">ยังไม่มีประวัติการอนุมัติหรือใช้คะแนน</p>;
  }

  return (
    <div className="space-y-3">
      {history.map((tx) => (
        <div key={tx.id} className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm">
          <div>
            <span className={tx.type === "EARNED" ? "text-green-600 font-bold mr-2" : "text-red-500 font-bold mr-2"}>
              {tx.type === "EARNED" ? "อนุมัติ" : "ใช้คะแนน"}
            </span>
            <span className="text-gray-700">ให้นักเรียน {tx.student.name}</span>
            <p className="text-gray-500 text-xs mt-1">เหตุผล: {tx.description}</p>
          </div>
          <div className="text-right">
            <span className={`font-bold ${tx.type === "EARNED" ? "text-green-600" : "text-red-500"}`}>
              {tx.type === "EARNED" ? "+" : "-"}{tx.amount}
            </span>
            <p className="text-gray-400 text-xs mt-1">{new Date(tx.createdAt).toLocaleString("th-TH")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
