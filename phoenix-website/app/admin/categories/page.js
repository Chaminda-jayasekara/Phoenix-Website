import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CategoryDeleteButton from "@/components/admin/CategoryDeleteButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await supabaseAdmin.from("categories").select("*").order("sort_order");

  return (
    <div>
      <Link href="/admin" className="text-muted text-[12.5px]">
        ← Admin
      </Link>
      <div className="flex items-center justify-between mt-3 mb-4">
        <h2 className="text-xl font-extrabold">Categories</h2>
        <Link href="/admin/categories/new" className="text-flame2 text-[13px] font-semibold">
          + Add category
        </Link>
      </div>

      {error && <p className="text-danger text-sm">Failed to load: {error.message}</p>}

      <div className="flex flex-col gap-3">
        {(categories || []).map((c) => (
          <div key={c.id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">{c.label}</div>
              <div className="text-muted text-[11.5px] mt-0.5">
                /{c.slug} · order {c.sort_order}
                {c.has_submission === false && " · no submission"}
                {c.supports_group_entry && " · group entries"}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Link href={`/admin/categories/${c.id}`} className="text-teal text-[12.5px] font-semibold">
                Edit
              </Link>
              <CategoryDeleteButton id={c.id} />
            </div>
          </div>
        ))}
        {(categories || []).length === 0 && (
          <div className="text-muted text-sm text-center py-6">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
