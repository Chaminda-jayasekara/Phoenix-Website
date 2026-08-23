import "./globals.css";
import Link from "next/link";
import { PhoenixMark } from "@/components/ui";

export const metadata = {
  title: "PHOENIX'26 — All Island Media Competition",
  description:
    "PHOENIX'26 — the inter-university and inter-school media competition organized by J'pura Flames, the Official Media Grid of the University of Sri Jayewardenepura.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-ink text-white flex flex-col">
          <header className="border-b border-border px-5 py-4 flex items-center justify-between sticky top-0 bg-ink/95 backdrop-blur z-10">
            <Link href="/" className="flex items-center gap-2">
              <PhoenixMark size={26} />
              <span className="font-extrabold text-[17px] tracking-wide">
                PHOENIX<span className="text-flame2">&apos;26</span>
              </span>
            </Link>
            <nav className="flex items-center gap-2.5 text-[12px] text-muted flex-wrap justify-end">
              <Link href="/register/school" className="hover:text-white">
                School
              </Link>
              <span className="text-border">|</span>
              <Link href="/register/university" className="hover:text-white">
                University
              </Link>
              <span className="text-border">|</span>
              <Link href="/categories" className="hover:text-white">
                Compete
              </Link>
              <span className="text-border">|</span>
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            </nav>
          </header>
          <main className="flex-1 w-full">{children}</main>
          <footer className="border-t border-border px-5 py-6 text-center text-muted text-[11px]">
            Organized by <span className="text-flame2 font-semibold">J&apos;pura Flames</span> — Official Media
            Grid, University of Sri Jayewardenepura
          </footer>
        </div>
      </body>
    </html>
  );
}
