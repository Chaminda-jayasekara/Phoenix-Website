import Link from "next/link";
import { Card } from "@/components/ui";

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">
          Register your institution
        </h1>
        <p className="text-muted text-sm mt-2">
          Every school and university registers once. Your office bearers get added
          automatically, and you&apos;ll receive a WhatsApp group link on submission.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/register/school">
          <Card className="hover:border-flame1 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-base">School Registration</div>
                <div className="text-muted text-[12.5px] mt-1">
                  Name, province/district, MIC, President, Secretary
                </div>
              </div>
              <div className="text-flame2 text-xl">→</div>
            </div>
          </Card>
        </Link>

        <Link href="/register/university">
          <Card className="hover:border-flame1 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-base">University Registration</div>
                <div className="text-muted text-[12.5px] mt-1">
                  Govt list or other, Senior Treasurer/MIC, President, Secretary
                </div>
              </div>
              <div className="text-flame2 text-xl">→</div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-base">Already registered?</div>
            <div className="text-muted text-[12.5px] mt-1">Enter a competition category as a contestant.</div>
          </div>
          <Link href="/categories" className="text-flame2 text-sm font-semibold">
            Browse categories →
          </Link>
        </div>
      </div>
    </div>
  );
}
