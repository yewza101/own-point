import { getLoggedTeacher, logoutTeacher } from "@/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const teacher = await getLoggedTeacher();

  if (!teacher) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 bg-white rounded-2xl shadow-md p-6 h-fit border-t-4 border-pink-500">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">ระบบแอดมิน</h2>
          <p className="text-sm text-pink-500">ยินดีต้อนรับ, {teacher.name}</p>
        </div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors">
            🏠 แดชบอร์ด (อนุมัติคะแนน)
          </Link>
          <Link href="/admin/students" className="block p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors">
            👥 จัดการนักเรียน
          </Link>
          {teacher.role === "ADMIN" && (
            <Link href="/admin/teachers" className="block p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors">
              👨‍🏫 จัดการคุณครู
            </Link>
          )}
        </nav>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <form action={async () => {
            "use server";
            await logoutTeacher();
            redirect("/");
          }}>
            <button type="submit" className="w-full text-left p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
              🚪 ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
