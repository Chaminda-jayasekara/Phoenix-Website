import Link from "next/link";
import { Card } from "@/components/ui";
import Countdown from "@/components/Countdown";
import RulesEmbed from "@/components/RulesEmbed";
import { getSiteSettings } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-[11px] tracking-[0.2em] text-flame2 font-semibold uppercase mb-2">
          Rising From The Ashes
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight leading-none mb-1">
          PHOENIX<span className="text-flame2">&apos;26</span>
        </h1>
        <div className="text-muted text-[11.5px] tracking-wide uppercase">All Island Media Competition</div>
      </div>

      <Countdown targetDate={settings?.event_date} />

      <p className="text-muted text-sm text-center leading-relaxed mt-6 mb-8">
        {settings?.hero_description ||
          "A celebration of creativity, resilience, and innovation in media arts. Get ready to witness the rebirth of ideas and the rise of new voices!"}
      </p>

      <div className="mb-8">
        <div className="text-[12.5px] text-muted mb-3 font-semibold">Rules & Regulations</div>
        <RulesEmbed videoUrl={settings?.general_rules_video_url} pdfUrl={settings?.general_rules_pdf_url} />
      </div>

      <Link href="/categories">
        <Card className="hover:border-flame1 transition-colors cursor-pointer mb-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-base">Browse Competition Categories</div>
              <div className="text-muted text-[12.5px] mt-1">
                Graphic Design, Videography, Photography, and more
              </div>
            </div>
            <div className="text-flame2 text-xl">→</div>
          </div>
        </Card>
      </Link>

      <div className="pt-6 border-t border-border">
        <div className="font-bold text-base mb-1">Institution Registration</div>
        <p className="text-muted text-[12.5px] mb-4">
          Every school and university registers once, before students can enter a category.
        </p>
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
      </div>
    </div>
  );
}
