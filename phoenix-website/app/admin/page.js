import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminList from "@/components/AdminList";

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
        <h2 className="text-xl font-extrabold mb-2">Registered institutions</h2>
        <p className="text-danger text-sm">Failed to load institutions: {instError.message}</p>
      </div>
    );
  }

  const ids = (institutions || []).map((i) => i.id);

  let bearers = [];
  let bearerError = null;
  if (ids.length > 0) {
    const res = await supabaseAdmin.from("office_bearers").select("*").in("institution_id", ids);
    bearers = res.data || [];
    bearerError = res.error;
  }

  const merged = (institutions || []).map((inst) => ({
    ...inst,
    office_bearers: bearers.filter((b) => b.institution_id === inst.id),
  }));

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-1">Registered institutions</h2>
      <p className="text-muted text-[12.5px] mb-4">
        {merged.length} total registration{merged.length === 1 ? "" : "s"}.
        {bearerError && (
          <span className="text-danger block mt-1">
            (Office bearer details failed to load: {bearerError.message})
          </span>
        )}
      </p>
      <AdminList institutions={merged} />
    </div>
  );
}
