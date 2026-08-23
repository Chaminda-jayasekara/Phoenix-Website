import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import RulesEmbed from "@/components/RulesEmbed";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  return { title: category ? `${category.label} Rules — Phoenix` : "Phoenix" };
}

export default function CategoryRulesPage({ params }) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-xl font-extrabold mb-1">{category.label} — Rules & Regulations</h1>
      <p className="text-muted text-[12.5px] mb-6">{category.description}</p>

      <RulesEmbed videoUrl={category.rulesVideoUrl} pdfUrl={category.rulesPdfUrl} />

      <div className="mt-6 pt-5 border-t border-border flex justify-between items-center">
        <Link href="/categories" className="text-muted text-[12.5px]">
          ← All categories
        </Link>
        <Link href={`/categories/${category.slug}`} className="text-flame2 text-sm font-semibold">
          Continue to registration →
        </Link>
      </div>
    </div>
  );
}
