"use client";

import { useState } from "react";
import { useStudentPoints } from "@/actions/usePoints";
import { updateStudentAction, deleteStudentAction } from "@/actions/student";

interface Props {
  student: {
    id: string;
    name: string;
    currentPoints: number;
    usedPoints: number;
    classLevel: string;
    room: string;
  };
}

export default function StudentRow({ student }: Props) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState(student.name);
  const [editClass, setEditClass] = useState(student.classLevel);
  const [editRoom, setEditRoom] = useState(student.room);

  const handleUsePoints = async () => {
    const pointsStr = prompt(`ต้องการใช้คะแนนของ ${student.name} จำนวนเท่าไร? (คะแนนคงเหลือ: ${student.currentPoints})`);
    if (!pointsStr) return;
    
    const points = parseInt(pointsStr, 10);
    if (isNaN(points) || points <= 0 || points > student.currentPoints) {
      alert("กรุณากรอกจำนวนคะแนนให้ถูกต้อง และไม่เกินคะแนนที่มีอยู่");
      return;
    }

    const description = prompt("กรุณาระบุเหตุผลที่ใช้คะแนน (เช่น แลกสมุด, แลกสิทธิพิเศษ):");
    if (!description) return;

    setLoading(true);
    const res = await useStudentPoints(student.id, points, description);
    setLoading(false);

    if (res.success) {
      alert("ใช้คะแนนสำเร็จ!");
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.error}`);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    const res = await updateStudentAction(student.id, editName, editClass, editRoom);
    setLoading(false);
    if (res.success) {
      setIsEditing(false);
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายชื่อนักเรียน "${student.name}"?\nข้อมูลคะแนนและประวัติทั้งหมดจะถูกลบทิ้งและไม่สามารถกู้คืนได้!`)) {
      setLoading(true);
      const res = await deleteStudentAction(student.id);
      if (!res.success) {
        alert(res.error);
        setLoading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <tr className="bg-yellow-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="flex gap-2">
            ม.
            <input type="text" value={editClass} onChange={e => setEditClass(e.target.value)} className="w-12 border rounded p-1 text-center" />
            /
            <input type="text" value={editRoom} onChange={e => setEditRoom(e.target.value)} className="w-12 border rounded p-1 text-center" />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="border rounded p-1 w-full" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span className="font-bold text-green-600">{student.currentPoints}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button onClick={handleSaveEdit} disabled={loading} className="text-green-600 hover:text-green-900 mr-3">บันทึก</button>
          <button onClick={() => setIsEditing(false)} disabled={loading} className="text-gray-500 hover:text-gray-700">ยกเลิก</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ม.{student.classLevel}/{student.room}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="font-bold text-green-600 text-base">{student.currentPoints}</span> 
        <span className="text-gray-400 text-xs ml-2">(ใช้ไป {student.usedPoints})</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
        <button 
          onClick={handleUsePoints}
          disabled={loading || student.currentPoints <= 0}
          className="text-white bg-pink-500 hover:bg-pink-600 px-3 py-1.5 rounded shadow-sm mr-4 disabled:bg-gray-300 transition-colors text-xs"
        >
          {loading ? "..." : "ใช้คะแนน"}
        </button>
        
        <button onClick={() => setIsEditing(true)} disabled={loading} className="text-yellow-600 hover:text-yellow-900 mr-3">
          แก้ไข
        </button>
        <button onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-700">
          ลบ
        </button>
      </td>
    </tr>
  );
}
