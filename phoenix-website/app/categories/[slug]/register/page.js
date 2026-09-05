import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryRegistrationForm from "@/components/CategoryRegistrationForm";
import PageShell from "@/components/PageShell";

// Cached for 60 seconds, then refreshed on the next request — avoids
// hitting the database on every single page view under high traffic,
// while staying close enough to real-time for content that rarely
// changes mid-minute (categories, rules, settings).
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  return { title: category ? `Register — ${category.label} — PHOENIX'26` : "PHOENIX'26" };
}

export default async function CategoryRegisterPage({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();
  return (
    <PageShell>
      <CategoryRegistrationForm category={category} />
    </PageShell>
  );
}
