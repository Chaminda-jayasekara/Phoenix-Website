import "./globals.css";
import Link from "next/link";
import { PhoenixMark } from "@/components/ui";

export const metadata = {
  title: "Phoenix — Competition Registration",
  description: "Register your school or university and enter Phoenix competition categories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-ink text-white">
          <header className="border-b border-border px-5 py-4 flex items-center justify-between sticky top-0 bg-ink/95 backdrop-blur z-10">
            <Link href="/" className="flex items-center gap-2">
              <PhoenixMark size={26} />
              <span className="font-extrabold text-[17px] tracking-wide">PHOENIX</span>
            </Link>
            <nav className="flex items-center gap-3 text-[12.5px] text-muted">
              <Link href="/register/school" className="hover:text-white">
                School
              </Link>
              <span className="text-border">|</span>
              <Link href="/register/university" className="hover:text-white">
                University
              </Link>
              <span className="text-border">|</span>
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            </nav>
          </header>
          <main className="max-w-lg mx-auto px-5 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
