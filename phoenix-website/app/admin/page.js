import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminTabs from "@/components/AdminTabs";
import { CATEGORIES } from "@/lib/data";

// Always fetch fresh data — this page must never be statically cached
// or served from Next.js's fetch cache, since it shows live registrations.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminPage() {
  const { data: institutions, error: instError } = await supabaseAdmin
    .from("institutions")
    .select("*")
    .order("created_at", { ascending: false });

  if (instError) {
    return (
      <div>
        <h2 className="text-xl font-extrabold mb-2">Admin</h2>
        <p className="text-danger text-sm">Failed to load institutions: {instError.message}</p>
      </div>
    );
  }

  const instIds = (institutions || []).map((i) => i.id);

  let bearers = [];
  if (instIds.length > 0) {
    const res = await supabaseAdmin.from("office_bearers").select("*").in("institution_id", instIds);
    bearers = res.data || [];
  }

  const mergedInstitutions = (institutions || []).map((inst) => ({
    ...inst,
    office_bearers: bearers.filter((b) => b.institution_id === inst.id),
  }));

  const { data: contestants, error: contError } = await supabaseAdmin
    .from("contestants")
    .select("*")
    .order("created_at", { ascending: false });

  let mergedContestants = [];
  if (!contError && contestants) {
    const contIds = contestants.map((c) => c.id);
    let submissions = [];
    if (contIds.length > 0) {
      const res = await supabaseAdmin.from("submissions").select("*").in("contestant_id", contIds);
      submissions = res.data || [];
    }
    const institutionById = Object.fromEntries((institutions || []).map((i) => [i.id, i.name]));
    mergedContestants = contestants.map((c) => ({
      ...c,
      institution_name: institutionById[c.institution_id],
      submission_link: submissions.find((s) => s.contestant_id === c.id)?.submission_link || null,
    }));
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-1">Admin</h2>
      <p className="text-muted text-[12.5px] mb-5">All registrations across Phoenix.</p>
      <AdminTabs institutions={mergedInstitutions} contestants={mergedContestants} categories={CATEGORIES} />
    </div>
  );
}
