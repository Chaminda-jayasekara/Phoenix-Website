import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/data";
import CategoryRegistrationForm from "@/components/CategoryRegistrationForm";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  return { title: category ? `${category.label} — Phoenix` : "Phoenix" };
}

export default function CategoryPage({ params }) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();
  return <CategoryRegistrationForm category={category} />;
}
