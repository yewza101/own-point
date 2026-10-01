import { getLoggedStudent, logoutStudent } from "@/actions/studentAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await getLoggedStudent();

  if (!student) {
    redirect("/student/login");
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex justify-between items-center border-t-4 border-yellow-400">
        <div>
          <p className="text-gray-500 text-sm">นักเรียน</p>
          <p className="font-bold text-gray-800 text-lg">{student.name} (ม.{student.classLevel}/{student.room})</p>
        </div>
        <form action={async () => {
          "use server";
          await logoutStudent();
          redirect("/");
        }}>
          <button type="submit" className="text-red-500 hover:text-red-700 font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            ออกระบบ
          </button>
        </form>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
