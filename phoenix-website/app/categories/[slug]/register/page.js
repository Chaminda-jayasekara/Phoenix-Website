import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryRegistrationForm from "@/components/CategoryRegistrationForm";
import PageShell from "@/components/PageShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
