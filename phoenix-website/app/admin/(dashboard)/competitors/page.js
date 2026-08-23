import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CompetitorsTable from "@/components/admin/CompetitorsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminCompetitorsPage() {
  const { data: contestants, error } = await supabaseAdmin
    .from("contestants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-extrabold mb-2">Registered Competitors</h1>
        <p className="text-danger text-sm">Failed to load: {error.message}</p>
      </div>
    );
  }

  const contIds = (contestants || []).map((c) => c.id);
  let submissions = [];
  if (contIds.length > 0) {
    const res = await supabaseAdmin.from("submissions").select("*").in("contestant_id", contIds);
    submissions = res.data || [];
  }

  const { data: institutions } = await supabaseAdmin.from("institutions").select("id, name");
  const institutionById = Object.fromEntries((institutions || []).map((i) => [i.id, i.name]));

  const { data: categoriesData } = await supabaseAdmin.from("categories").select("*").order("sort_order");
  const categories = (categoriesData || []).map((c) => ({ dbCategory: c.slug, label: c.label }));

  const merged = (contestants || []).map((c) => ({
    ...c,
    institution_name: institutionById[c.institution_id],
    submission_link: submissions.find((s) => s.contestant_id === c.id)?.submission_link || null,
  }));

  return (
    <div>
      <h1 className="text-xl font-extrabold mb-1">Registered Competitors</h1>
      <p className="text-muted text-[12.5px] mb-5">
        {merged.length} total registration{merged.length === 1 ? "" : "s"}.
      </p>
      <CompetitorsTable contestants={merged} categories={categories} />
    </div>
  );
}
