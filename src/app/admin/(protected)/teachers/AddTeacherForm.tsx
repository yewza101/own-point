"use client";

import { useState } from "react";
import { addTeacherAction } from "@/actions/teacherAdmin";

export default function AddTeacherForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await addTeacherAction(name, username, password);
    setLoading(false);

    if (res.success) {
      alert("เพิ่มคุณครูสำเร็จ!");
      setName("");
      setUsername("");
      setPassword("");
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (คุณครู)</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded" placeholder="เช่น ครูสมศรี เรียนดี" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username (สำหรับล็อกอิน)</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full border p-2 rounded" placeholder="เช่น somsri" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-2 rounded" placeholder="ตั้งรหัสผ่าน" />
      </div>
      <button type="submit" disabled={loading} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg">
        {loading ? "กำลังเพิ่ม..." : "เพิ่มคุณครู"}
      </button>
    </form>
  );
}
