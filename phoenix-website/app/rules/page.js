import RulesEmbed from "@/components/RulesEmbed";
import { GENERAL_RULES } from "@/lib/data";

export const metadata = { title: "Rules & Regulations — Phoenix" };

export default function RulesPage() {
  return (
    <div>
      <h1 className="text-xl font-extrabold mb-1">Rules & Regulations</h1>
      <p className="text-muted text-[12.5px] mb-6">
        General rules for institution registration and participation in Phoenix. Each competition
        category has its own additional rules on its registration page.
      </p>
      <RulesEmbed videoUrl={GENERAL_RULES.videoUrl} pdfUrl={GENERAL_RULES.pdfUrl} />
    </div>
  );
}
