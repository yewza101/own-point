"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDeedRequest } from "@/actions/deed";

interface Props {
  teachers: { id: string; name: string }[];
}

export default function AddDeedForm({ teachers }: Props) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !teacherId) {
      setError("กรุณากรอกข้อมูลและเลือกคุณครูให้ครบ");
      return;
    }

    setLoading(true);
    setError("");

    const res = await submitDeedRequest(teacherId, description);
    
    if (res.success) {
      router.push("/student/dashboard");
      router.refresh();
    } else {
      setError(res.error || "เกิดข้อผิดพลาด");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
      
      <div>
        <label className="block text-gray-700 font-semibold mb-2">ความดีที่ได้ทำ</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="เช่น ช่วยครูยกของ, ทำความสะอาดห้องเรียน..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">ส่งให้คุณครูรับรอง</label>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
          required
        >
          <option value="">-- เลือกคุณครู --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:bg-pink-300"
      >
        {loading ? "กำลังบันทึก..." : "ส่งให้ครูรับรอง"}
      </button>
    </form>
  );
}
