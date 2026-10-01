import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-4">
          ยินดีต้อนรับสู่ <span className="text-yellow-500 drop-shadow-sm">OWN-POINT</span>
        </h1>
        <p className="text-lg text-gray-600">ระบบสะสมและใช้คะแนนความดี</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Student Card */}
        <Link href="/student/login">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-t-4 border-yellow-400 flex flex-col items-center group hover:-translate-y-1 transform duration-200">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">นักเรียน</h2>
            <p className="text-gray-500 mt-2 text-center">เข้าสู่ระบบเพื่อดูคะแนน และส่งบันทึกความดี</p>
          </div>
        </Link>

        {/* Teacher Card */}
        <Link href="/admin/login">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-t-4 border-pink-500 flex flex-col items-center group hover:-translate-y-1 transform duration-200">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">คุณครู / แอดมิน</h2>
            <p className="text-gray-500 mt-2 text-center">เข้าสู่ระบบหลังบ้าน จัดการข้อมูล และให้คะแนน</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
