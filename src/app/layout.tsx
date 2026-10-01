import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({ subsets: ["latin", "thai"] });

export const metadata: Metadata = {
  title: "OWN-POINT",
  description: "ระบบบันทึกคะแนนความดี",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} bg-pink-50 text-gray-800 min-h-screen`}>
        {/* Navigation Bar */}
        <nav className="bg-pink-500 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="text-2xl font-bold text-yellow-300 drop-shadow-md">
                  OWN-POINT
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
