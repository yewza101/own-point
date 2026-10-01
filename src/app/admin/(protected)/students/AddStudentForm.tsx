"use client";

import { useState } from "react";
import { addStudentsAction } from "@/actions/student";

export default function AddStudentForm() {
  const [classLevel, setClassLevel] = useState("1");
  const [room, setRoom] = useState("1");
  const [names, setNames] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const nameList = names.split("\n").map(n => n.trim()).filter(n => n.length > 0);
    
    if (nameList.length === 0) {
      setMessage("กรุณากรอกชื่ออย่างน้อย 1 ชื่อ");
      setLoading(false);
      return;
    }

    const res = await addStudentsAction(classLevel, room, nameList);
    setLoading(false);

    if (res.success) {
      setMessage(`✅ เพิ่มนักเรียนสำเร็จ ${nameList.length} คน`);
      setNames(""); // Clear input
    } else {
      setMessage(`❌ เกิดข้อผิดพลาด: ${res.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">ชั้น (ม.)</label>
          <select value={classLevel} onChange={e => setClassLevel(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500">
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">ห้อง</label>
          <select value={room} onChange={e => setRoom(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          วางรายชื่อนักเรียน (คัดลอกลงมาบรรทัดละ 1 ชื่อ)
        </label>
        <textarea
          rows={5}
          value={names}
          onChange={e => setNames(e.target.value)}
          placeholder="นายสมชาย ใจดี&#10;นางสาวสมหญิง รักเรียน"
          className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? "กำลังบันทึก..." : "เพิ่มนักเรียน"}
      </button>
      {message && <p className="mt-2 text-sm font-medium text-pink-600">{message}</p>}
    </form>
  );
}
