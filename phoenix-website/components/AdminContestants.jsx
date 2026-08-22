"use client";

import { useState } from "react";
import { Card, ReviewRow } from "@/components/ui";

export default function AdminContestants({ contestants, categories }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? contestants : contestants.filter((c) => c.category === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {categories.map((c) => (
          <FilterPill key={c.dbCategory} active={filter === c.dbCategory} onClick={() => setFilter(c.dbCategory)} label={c.label} />
        ))}
      </div>

      {filtered.length === 0 && <Card className="text-center text-muted text-sm">No entries yet.</Card>}

      <div className="flex flex-col gap-3">
        {filtered.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div>
                <div className="font-bold text-[14.5px]">{c.full_name}</div>
                <div className="text-[11.5px] text-muted mt-0.5">
                  {categoryLabel(c.category, categories)} · {c.age_category}
                  {c.sub_category ? ` · ${c.sub_category}` : ""} · {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className="text-muted text-lg">{expanded === c.id ? "−" : "+"}</span>
            </div>
            {expanded === c.id && (
              <div className="mt-3.5 border-t border-border pt-3.5">
                <ReviewRow label="Name with initials" value={c.name_with_initials} />
                <ReviewRow label="Contact" value={c.contact} />
                <ReviewRow label="Email" value={c.email} />
                <ReviewRow label="Institution" value={c.institution_name || "—"} />
                {c.submission_link ? (
                  <ReviewRow
                    label="Submission"
                    value={
                      <a href={c.submission_link} className="text-teal break-all" target="_blank" rel="noreferrer">
                        {c.submission_link}
                      </a>
                    }
                  />
                ) : (
                  <ReviewRow label="Submission" value="— (no submission required for this category)" />
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function categoryLabel(dbCategory, categories) {
  return categories.find((c) => c.dbCategory === dbCategory)?.label || dbCategory;
}

function FilterPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`text-[12px] px-3 py-1.5 rounded-full border border-border font-semibold ${
        active ? "bg-ember text-ink" : "text-muted"
      }`}
    >
      {label}
    </button>
  );
}
