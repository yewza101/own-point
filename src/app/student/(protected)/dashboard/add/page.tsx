import { PrismaClient } from "@prisma/client";
import AddDeedForm from "./AddDeedForm";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AddDeedPage() {
  const teachers = await prisma.teacher.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-pink-500 max-w-lg mx-auto mt-4">
      <div className="flex items-center mb-6">
        <Link href="/student/dashboard" className="text-gray-400 hover:text-pink-500 mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">เพิ่มบันทึกความดี</h2>
      </div>
      
      <AddDeedForm teachers={teachers} />
    </div>
  );
}
