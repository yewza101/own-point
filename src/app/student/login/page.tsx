"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStudentsByClass } from "@/actions/student";
import { setStudentSession } from "@/actions/studentAuth";

export default function StudentLogin() {
  const router = useRouter();
  const [classLevel, setClassLevel] = useState("1");
  const [room, setRoom] = useState("1");
  const [students, setStudents] = useState<{id:string; name:string}[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch students when class or room changes
    getStudentsByClass(classLevel, room).then(setStudents);
    setSelectedStudent("");
  }, [classLevel, room]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setLoading(true);
    await setStudentSession(selectedStudent);
    router.push("/student/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-yellow-400">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6 drop-shadow-sm">
          เข้าสู่ระบบ (นักเรียน)
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">ชั้น (ม.)</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">ห้อง</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">เลือกชื่อนักเรียน</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">-- กรุณาเลือกรายชื่อ --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {students.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">ยังไม่มีรายชื่อนักเรียนในห้องนี้</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedStudent || loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-yellow-600 underline">
            กลับไปหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
