"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTeachersForDropdown } from "@/actions/teacher";
import { loginTeacher } from "@/actions/auth";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<{ username: string; name: string }[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTeachersForDropdown().then(setTeachers);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("กรุณาเลือกชื่อและกรอกรหัสผ่าน");
      return;
    }

    setLoading(true);
    const result = await loginTeacher(username, password);
    setLoading(false);

    if (result.success) {
      router.push("/admin/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-t-4 border-pink-500">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          เข้าสู่ระบบ (ครู/แอดมิน)
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">เลือกชื่อคุณครู</label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="">-- กรุณาเลือก --</option>
              {teachers.map((t) => (
                <option key={t.username} value={t.username}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:bg-pink-300"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-pink-500 underline">
            กลับไปหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
