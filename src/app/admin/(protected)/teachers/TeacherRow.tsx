"use client";

import { useState } from "react";
import { deleteTeacherAction } from "@/actions/teacherAdmin";

interface Props {
  teacher: { id: string; name: string; username: string; role: string };
}

export default function TeacherRow({ teacher }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (teacher.role === "ADMIN") {
      alert("ไม่สามารถลบแอดมินหลักได้");
      return;
    }

    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบคุณครู "${teacher.name}"?`)) {
      setLoading(true);
      const res = await deleteTeacherAction(teacher.id);
      if (!res.success) {
        alert(res.error);
        setLoading(false);
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.username}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {teacher.role === "ADMIN" ? (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Admin</span>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Teacher</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {teacher.role !== "ADMIN" && (
          <button onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700">ลบ</button>
        )}
      </td>
    </tr>
  );
}
